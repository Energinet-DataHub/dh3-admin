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
using Energinet.DataHub.Charges.Clients.Charges;
using Energinet.DataHub.Charges.Contracts.Charge;
using Energinet.DataHub.Charges.Contracts.ChargeMessage;
using Energinet.DataHub.Charges.Contracts.ChargePrice;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class ChargesController : ControllerBase
    {
        private readonly IChargesClient _chargesClient;

        public ChargesController(IChargesClient chargesClient)
        {
            _chargesClient = chargesClient;
        }

        [HttpPost("SearchAsync")]
        public async Task<ActionResult<IList<ChargeV1Dto>>> SearchAsync([FromBody] ChargeSearchCriteriaV1Dto searchCriteria)
        {
            var result = await _chargesClient.SearchChargesAsync(searchCriteria);

            return result.Any() ? Ok(result) : NotFound();
        }

        [HttpGet("GetMarketParticipantsAsync")]
        public async Task<ActionResult<IList<MarketParticipantV1Dto>>> GetMarketParticipantsAsync()
        {
            var result = await _chargesClient.GetMarketParticipantsAsync();

            return result.Any() ? Ok(result) : NotFound();
        }

        [HttpPost("SearchChargePricesAsync")]
        public async Task<ActionResult<ChargePricesV1Dto>> SearchChargePricesAsync([FromBody] ChargePricesSearchCriteriaV1Dto searchCriteria)
        {
            var result = await _chargesClient.SearchChargePricesAsync(searchCriteria);

            return result;
        }

        [HttpPost("SearchChargeMessagesAsync")]
        public async Task<ActionResult<ChargeMessagesV1Dto>> SearchChargeMessagesAsync([FromBody] ChargeMessagesSearchCriteriaV1Dto searchCriteria)
        {
            var result = await _chargesClient.SearchChargeMessagesAsync(searchCriteria);

            return result;
        }

        [HttpPost("CreateChargeAsync")]
        public async Task<ActionResult> CreateChargeAsync([FromBody] CreateChargeV1Dto createChargeV1Dto)
        {
            await _chargesClient.CreateChargeAsync(createChargeV1Dto);

            return Ok();
        }
    }
}
