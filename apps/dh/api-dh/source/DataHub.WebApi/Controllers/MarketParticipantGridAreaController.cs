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
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers;

[ApiController]
[Route("v1/[controller]")]
public class MarketParticipantGridAreaController : MarketParticipantControllerBase
{
    private readonly IMarketParticipantClient_V1 _client;

    public MarketParticipantGridAreaController(IMarketParticipantClient_V1 client)
    {
        _client = client;
    }

    /// <summary>
    /// Retrieves all grid areas
    /// </summary>
    [HttpGet]
    [Route("GetAllGridAreas")]
    public Task<ActionResult<ICollection<GridAreaDto>>> GetAllGridAreasAsync()
    {
        return HandleExceptionAsync(() => _client.GridAreaGetAsync());
    }

    [HttpPut]
    [Route("UpdateGridAreaName")]
    public Task<ActionResult> UpdateGridAreaNameAsync(ChangeGridAreaDto changes)
    {
        return HandleExceptionAsync(() => _client.GridAreaPutAsync(changes));
    }
}
