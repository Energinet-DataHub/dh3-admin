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
using Energinet.DataHub.MessageArchive.Client.Abstractions;
using Energinet.DataHub.MessageArchive.Client.Abstractions.Models;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class MessageArchiveController : ControllerBase
    {
        private readonly IMessageArchiveClient _messageArchiveClient;

        public MessageArchiveController(IMessageArchiveClient messageArchiveClient)
        {
            _messageArchiveClient = messageArchiveClient;
        }

        /// <summary>
        /// Get saved request and response logs
        /// </summary>
        /// <param name="searchCriteria">search criteria input</param>
        /// <returns>Search result.</returns>
        [HttpPost("SearchRequestResponseLogs")]
        public async Task<ActionResult<SearchResultsDto>> SearchRequestResponseLogsAsync(SearchCriteria searchCriteria)
        {
            var result = await _messageArchiveClient.SearchLogsAsync(searchCriteria).ConfigureAwait(false);

            return result == null || !result.Result.Any() ? NoContent() : Ok(result);
        }

        /// <summary>
        /// Download log content as stream
        /// </summary>
        /// <param name="blobName">blob name</param>
        /// <returns>log content</returns>
        [HttpPost("DownloadRequestResponseLogContent")]
        public async Task<ActionResult<Stream>> DownloadRequestResponseLogContentAsync(string blobName)
        {
            var stream = await _messageArchiveClient.GetStreamFromStorageAsync(blobName).ConfigureAwait(false);

            return File(stream, MediaTypeNames.Text.Plain);
        }
    }
}
