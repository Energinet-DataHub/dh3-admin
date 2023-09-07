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
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.ESettExchange.v1;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public sealed class EsettExchangeController : ControllerBase
    {
        private readonly IESettExchangeClient_V1 _client;

        public EsettExchangeController(IESettExchangeClient_V1 client)
        {
            _client = client;
        }

        [HttpGet("DispatchDocument")]
        [Produces("application/octet-stream")]
        public async Task<ActionResult<Stream>> GetDispatchDocumentAsync(string documentId)
        {
            try
            {
                var fileStream = await _client
                    .DispatchDocumentAsync(documentId);

                return File(
                    fileStream,
                    MediaTypeNames.Application.Octet);
            }
            catch (ApiException e) when (e.StatusCode == 404)
            {
                return NotFound();
            }
        }

        [HttpGet("ResponseDocument")]
        [Produces("application/octet-stream")]
        public async Task<ActionResult<Stream>> ResponseDocumentAsync(string documentId)
        {
            try
            {
                var fileStream = await _client
                    .ResponseDocumentAsync(documentId)
                    .ConfigureAwait(false);

                return File(
                    fileStream,
                    MediaTypeNames.Application.Octet);
            }
            catch (ApiException e) when (e.StatusCode == 404)
            {
                return NotFound();
            }
        }
    }
}
