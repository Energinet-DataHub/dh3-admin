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
using System.Collections.Generic;
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MarketParticipantGridAreaController : MarketParticipantControllerBase
    {
        private readonly IMarketParticipantClient _client;
        private readonly IMarketParticipantAuditIdentityClient _marketParticipantAuditIdentityClient;

        public MarketParticipantGridAreaController(
            IMarketParticipantClient client,
            IMarketParticipantAuditIdentityClient marketParticipantAuditIdentityClient)
        {
            _client = client;
            _marketParticipantAuditIdentityClient = marketParticipantAuditIdentityClient;
        }

        /// <summary>
        /// Retrieves all grid areas
        /// </summary>
        [HttpGet]
        [Route("GetAllGridAreas")]
        public Task<ActionResult<IEnumerable<GridAreaDto>>> GetAllGridAreasAsync()
        {
            return HandleExceptionAsync(() => _client.GetGridAreasAsync());
        }

        /// <summary>
        /// Retrieves all grid area audit logs for the given grid area
        /// </summary>
        [HttpGet("GetGridAreaAuditLogEntries")]
        public Task<ActionResult<IEnumerable<GridAreaAuditLogEntryWithNameDto>>> GetGridAreaAuditLogEntriesAsync(Guid gridAreaId)
        {
            return HandleExceptionAsync(async () =>
            {
                var auditLogs = await _client.GetGridAreaAuditLogEntriesAsync(gridAreaId).ConfigureAwait(false);
                var updatedAuditLogs = new List<GridAreaAuditLogEntryWithNameDto>();

                foreach (var auditLog in auditLogs)
                {
                    var auditIdentity = await _marketParticipantAuditIdentityClient
                        .GetAsync(auditLog.AuditIdentityId)
                        .ConfigureAwait(false);

                    updatedAuditLogs.Add(new GridAreaAuditLogEntryWithNameDto(
                        auditLog.Timestamp,
                        auditLog.OldValue,
                        auditLog.NewValue,
                        auditLog.GridAreaId,
                        auditIdentity.DisplayName,
                        auditLog.Field));
                }

                return (IEnumerable<GridAreaAuditLogEntryWithNameDto>)updatedAuditLogs;
            });
        }

        [HttpPut]
        [Route("UpdateGridAreaName")]
        public Task<ActionResult> UpdateGridAreaNameAsync(ChangeGridAreaDto changes)
        {
            return HandleExceptionAsync(() => _client.UpdateGridAreaAsync(changes));
        }
    }
}
