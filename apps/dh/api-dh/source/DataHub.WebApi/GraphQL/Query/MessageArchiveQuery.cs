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

using Energinet.DataHub.Edi.B2CWebApp.Clients.v1;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Microsoft.IdentityModel.Tokens;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL.Query;

public partial class Query
{
    [UsePaging]
    [UseSorting]
    public async Task<IEnumerable<ArchivedMessageResult>> GetArchivedMessagesAsync(
        Interval created,
        string? senderNumber,
        string? receiverNumber,
        DocumentType[]? documentTypes,
        BusinessReason[]? businessReasons,
        bool? includeRelated,
        string? filter,
        [Service] IEdiB2CWebAppClient_V1 client)
    {
        var search = !string.IsNullOrWhiteSpace(filter)
            ? new SearchArchivedMessagesCriteria()
            {
                MessageId = filter,
                IncludeRelatedMessages = includeRelated ?? false,
            }
            : new SearchArchivedMessagesCriteria()
            {
                CreatedDuringPeriod = new MessageCreationPeriod()
                {
                    Start = created.Start.ToDateTimeOffset(),
                    End = created.End.ToDateTimeOffset(),
                },
                SenderNumber = string.IsNullOrEmpty(senderNumber) ? null : senderNumber,
                ReceiverNumber = string.IsNullOrEmpty(receiverNumber) ? null : receiverNumber,
                DocumentTypes = documentTypes.IsNullOrEmpty()
                    ? null
                    : documentTypes?.Select(x => x.ToString()).ToArray(),
                BusinessReasons = businessReasons.IsNullOrEmpty()
                    ? null
                    : businessReasons?.Select(x => x.ToString()).ToArray(),
            };

        return await client.ArchivedMessageSearchAsync("1.0", search);
    }
}
