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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using HotChocolate;

namespace Energinet.DataHub.WebApi.Choco
{
    public class MarketParticipantResolvers
    {
        public Task<IEnumerable<UserRoleDto>> GetAssignedPermissionAsync(
            [Parent] PermissionDetailsDto permission,
            [Service] IMarketParticipantUserRoleClient client) =>
            client.GetAssignedToPermissionAsync(permission.Id);

        public async Task<IEnumerable<GridAreaDto>> GetGridAreasAsync(
            [Parent] ActorDto actor,
            GridAreaByIdBatchDataLoader dataLoader) =>
                await Task.WhenAll(
                    actor.MarketRoles
                        .SelectMany(marketRole => marketRole.GridAreas.Select(gridArea => gridArea.Id))
                        .Distinct()
                        .Select(async gridAreaId => await dataLoader.LoadAsync(gridAreaId)));

        public Task<OrganizationDto> GetOrganizationAsync(
            [Parent] ActorDto actor,
            [Service] IMarketParticipantClient client) =>
            client.GetOrganizationAsync(actor.OrganizationId);
    }
}
