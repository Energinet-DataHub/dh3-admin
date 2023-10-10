﻿// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using HotChocolate;
using HotChocolate.Types;
using NodaTime;
using EdiB2CWebAppProcessType = Energinet.DataHub.Edi.B2CWebApp.Clients.v1.ProcessType;
using ProcessType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ProcessType;

namespace Energinet.DataHub.WebApi.GraphQL;

public class Mutation
{
    [UseMutationConvention(Disable = true)]
    public Task<PermissionDetailsDto> UpdatePermissionAsync(
        UpdatePermissionDto input,
        [Service] IMarketParticipantPermissionsClient client) =>
        client
            .UpdatePermissionAsync(input)
            .Then(() => client.GetPermissionAsync(input.Id));

    [Error(typeof(MarketParticipantException))]
    public async Task<bool> UpdateActorAsync(
        Guid actorId,
        string actorName,
        string departmentName,
        string departmentEmail,
        string departmentPhone,
        [Service] IMarketParticipantClient client)
    {
        var actor = await client.GetActorAsync(actorId).ConfigureAwait(false);
        if (!string.Equals(actor.Name.Value, actorName, StringComparison.Ordinal))
        {
            var changes = new ChangeActorDto(
                actor.Status,
                new ActorNameDto(actorName),
                actor.MarketRoles);

            await client.UpdateActorAsync(actorId, changes).ConfigureAwait(false);
        }

        var allContacts = await client.GetContactsAsync(actorId).ConfigureAwait(false);
        var defaultContact = allContacts.SingleOrDefault(c => c.Category == ContactCategory.Default);
        if (defaultContact == null ||
            !string.Equals(defaultContact.Name, departmentName, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Email, departmentEmail, StringComparison.Ordinal) ||
            !string.Equals(defaultContact.Phone, departmentPhone, StringComparison.Ordinal))
        {
            if (defaultContact != null)
            {
                await client
                    .DeleteContactAsync(actorId, defaultContact.ContactId)
                    .ConfigureAwait(false);
            }

            var newDefaultContact = new CreateActorContactDto(
                departmentName,
                ContactCategory.Default,
                departmentEmail,
                departmentPhone);

            await client
                .CreateContactAsync(actorId, newDefaultContact)
                .ConfigureAwait(false);
        }

        return true;
    }

    public Task<BatchDto> CreateCalculationAsync(
        Interval period,
        string[] gridAreaCodes,
        ProcessType processType,
        [Service] IWholesaleClient_V3 client)
    {
        if (!period.HasEnd || !period.HasStart)
        {
            throw new Exception("Period cannot be open-ended");
        }

        var batchRequestDto = new BatchRequestDto
        {
            StartDate = period.Start.ToDateTimeOffset(),
            EndDate = period.End.ToDateTimeOffset(),
            GridAreaCodes = gridAreaCodes,
            ProcessType = processType,
        };

        return client
            .CreateBatchAsync(batchRequestDto)
            .Then(batchId => new BatchDto
            {
                BatchId = batchId,
                ExecutionState = BatchState.Pending,
                PeriodStart = batchRequestDto.StartDate,
                PeriodEnd = batchRequestDto.EndDate,
                ExecutionTimeEnd = null,
                ExecutionTimeStart = null,
                AreSettlementReportsCreated = false,
                GridAreaCodes = gridAreaCodes,
                ProcessType = processType,
            });
    }

    public async Task<bool> CreateAggregatedMeasureDataRequestAsync(
        EdiB2CWebAppProcessType processType,
        MeteringPointType meteringPointType,
        string startDate,
        string? endDate,
        string? gridArea,
        string? energySupplierId,
        string? balanceResponsibleId,
        CancellationToken cancellationToken,
        [Service] IEdiB2CWebAppClient_V1 client)
    {
        await client.RequestAggregatedMeasureDataAsync(
            new RequestAggregatedMeasureDataMarketRequest()
            {
                ProcessType = processType,
                MeteringPointType = meteringPointType,
                StartDate = startDate,
                EndDate = endDate,
                GridArea = gridArea,
                EnergySupplierId = energySupplierId,
                BalanceResponsibleId = balanceResponsibleId,
            },
            cancellationToken)
            .ConfigureAwait(false);
        return true;
    }
}
