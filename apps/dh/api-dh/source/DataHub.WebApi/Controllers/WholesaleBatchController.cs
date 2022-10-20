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
using System.IO;
using System.Threading.Tasks;
using Energinet.DataHub.Wholesale.Application.Batches;
using Energinet.DataHub.Wholesale.Client;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class WholesaleBatchController : ControllerBase
    {
        private readonly IWholesaleClient _client;

        public WholesaleBatchController(IWholesaleClient client)
        {
            _client = client;
        }

        /// <summary>
        /// Create a batch.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult> CreateAsync(BatchRequestDto batchRequestDto)
        {
            await _client.CreateBatchAsync(batchRequestDto).ConfigureAwait(false);
            return Ok();
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpPost("Search")]
        public async Task<ActionResult<IEnumerable<BatchDtoV2>>> PostAsync(BatchSearchDto batchSearchDto)
        {
            var batches = await _client.GetBatchesAsync(batchSearchDto).ConfigureAwait(false);
            return Ok(batches);
        }

        /// <summary>
        /// Get a batch.
        /// </summary>
        [HttpPost("ZippedBasisDataStream")]
        public async Task<ActionResult<Uri>> PostAsync(Guid batchId)
        {
            var stream = await _client.GetZippedBasisDataStreamAsync(batchId);
            return Ok(stream);
        }
    }
}
