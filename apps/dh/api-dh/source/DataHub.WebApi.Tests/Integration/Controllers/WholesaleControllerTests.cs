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
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.MarketParticipant.Client.Models;
using Energinet.DataHub.WebApi.Controllers.Wholesale.Dto;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.Wholesale.Contracts;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;
using BatchDtoV2 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.BatchDtoV2;
using BatchRequestDto = Energinet.DataHub.WebApi.Clients.Wholesale.v3.BatchRequestDto;
using BatchSearchDtoV2 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.BatchSearchDtoV2;
using BatchState = Energinet.DataHub.WebApi.Clients.Wholesale.v3.BatchState;
using ProcessStepResultDtoV3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ProcessStepResultDto;
using ProcessType = Energinet.DataHub.WebApi.Clients.Wholesale.v3.ProcessType;
using TimeSeriesTypeV3 = Energinet.DataHub.WebApi.Clients.Wholesale.v3.TimeSeriesType;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class WholesaleControllerTests : ControllerTestsBase
    {
        public WholesaleControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, factory, testOutputHelper)
        {
        }

        private const string BatchCreateUrl = "/v1/wholesalebatch";
        private const string BatchSearchUrl = "/v1/wholesalebatch/search";
        private const string BatchProcessStepResultUrl = "/v1/wholesalebatch/processstepresult";
        private const string GridAreaCode = "805";

        [Theory]
        [InlineAutoMoqData]
        public async Task CreateAsync_ReturnsOk(BatchRequestDto requestDto)
        {
            MockMarketParticipantClient();
            var actual = await BffClient.PostAsJsonAsync(BatchCreateUrl, requestDto);
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task GetAsync_ReturnsBatch_WithGridAreaNames(Guid batchId)
        {
            MockMarketParticipantClient();
            var batchDtoV2 = new BatchDtoV2(
                Guid.NewGuid(),
                BatchState.Completed,
                DateTimeOffset.Now,
                DateTimeOffset.Now,
                new[] { GridAreaCode },
                true,
                DateTimeOffset.Now,
                DateTimeOffset.Now,
                ProcessType.BalanceFixing);

            WholesaleClientV3Mock
                .Setup(m => m.GetBatchAsync(batchId, null, CancellationToken.None))
                .ReturnsAsync(batchDtoV2);
            var responseMessage = await BffClient.GetAsync($"/v1/WholesaleBatch/Batch?batchId={batchId}");

            var actual = await responseMessage.Content.ReadAsAsync<BatchDto>();
            foreach (var gridAreaDto in actual.GridAreas)
            {
                Assert.NotNull(gridAreaDto.Name);
            }
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task PostAsync_WhenBatchesFound_ReturnsOk(BatchSearchDtoV2 searchDto)
        {
            var batches = new List<BatchDtoV2>
            {
                new(
                    Guid.NewGuid(),
                    BatchState.Completed,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    new[] { GridAreaCode },
                    true,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    ProcessType.BalanceFixing),
            };
            WholesaleClientV3Mock
                .Setup(m => m.SearchBatchesAsync(searchDto, null, CancellationToken.None))
                .ReturnsAsync(batches);

            MockMarketParticipantClient();

            var actual = await BffClient.PostAsJsonAsync(BatchSearchUrl, searchDto);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task PostAsync_WhenNoBatchesFound_ReturnsOk(BatchSearchDtoV2 searchDto)
        {
            MockMarketParticipantClient();
            WholesaleClientV3Mock
                .Setup(m => m.SearchBatchesAsync(searchDto, null, CancellationToken.None))
                .ReturnsAsync(new List<BatchDtoV2>());

            var actual = await BffClient.PostAsJsonAsync(BatchSearchUrl, searchDto);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task PostAsync_WhenBatchesFound_GridAreasHaveNames(BatchSearchDtoV2 searchDto)
        {
            var batches = new List<BatchDtoV2>
            {
                new(
                    Guid.NewGuid(),
                    BatchState.Completed,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    new[] { GridAreaCode },
                    true,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now,
                    ProcessType.BalanceFixing),
            };
            WholesaleClientV3Mock
                .Setup(m => m.SearchBatchesAsync(searchDto, null, CancellationToken.None))
                .ReturnsAsync(batches);

            MockMarketParticipantClient();

            var responseMessage = await BffClient.PostAsJsonAsync(BatchSearchUrl, searchDto);
            var actual = await responseMessage.Content.ReadAsAsync<IEnumerable<BatchDto>>();
            foreach (var batchDto in actual)
            {
                foreach (var gridAreaDto in batchDto.GridAreas)
                {
                    Assert.NotNull(gridAreaDto.Name);
                }
            }
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task PostAsync_WhenProcessStepResultIsFound_ReturnsOk(
            ProcessStepResultRequestDtoV3 processStepResultRequestDto,
            ProcessStepResultDtoV3 processStepResultDto)
        {
            WholesaleClientV3Mock
                .Setup(m => m.GetProcessStepResultAsync(processStepResultRequestDto.BatchId, processStepResultRequestDto.GridAreaCode, (TimeSeriesTypeV3)processStepResultRequestDto.TimeSeriesType, processStepResultRequestDto.EnergySupplierGln, processStepResultRequestDto.BalanceResponsiblePartyGln, null, CancellationToken.None))
                .ReturnsAsync(processStepResultDto);

            var actual = await BffClient.PostAsJsonAsync(BatchProcessStepResultUrl, processStepResultRequestDto);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        private void MockMarketParticipantClient()
        {
            MarketParticipantClientMock.Setup(d => d.GetGridAreasAsync()).ReturnsAsync(new List<GridAreaDto>
            {
                new(
                    Guid.NewGuid(),
                    GridAreaCode,
                    "GridAreaCodeName",
                    PriceAreaCode.Dk1,
                    DateTimeOffset.Now,
                    DateTimeOffset.Now.AddDays(1)),
            });
        }
    }
}
