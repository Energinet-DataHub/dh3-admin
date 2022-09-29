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
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AutoFixture;
using Energinet.Charges.Contracts.ChargeLink;
using Energinet.DataHub.Charges.Clients.Charges;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class ChargeLinksControllerTests :
        WebApiTestBase<BffWebApiFixture>,
        IClassFixture<BffWebApiFixture>,
        IClassFixture<WebApiFactory>,
        IAsyncLifetime
    {
        private Fixture DtoFixture { get; }

        private Mock<IChargesClient> ApiClientMock { get; }

        private HttpClient Client { get; }

        public ChargeLinksControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
             : base(bffWebApiFixture, testOutputHelper)
        {
            DtoFixture = new Fixture();

            ApiClientMock = new Mock<IChargesClient>();
            Client = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.AddTransient(provider => ApiClientMock.Object);
                });
            })
            .CreateClient();

            factory.ReconfigureJwtTokenValidatorMock(isValid: true);
        }

        public Task InitializeAsync()
        {
            Client.DefaultRequestHeaders.Add("Authorization", $"Bearer xxx");
            return Task.CompletedTask;
        }

        public Task DisposeAsync()
        {
            Client.Dispose();
            return Task.CompletedTask;
        }

        [Fact]
        public async Task GetChargeLinksAsync_WhenMeteringPointIdHasChargeLinks_ReturnsOk()
        {
            // Arrange
            var meteringPointId = "571313180000000000";
            var requestUrl = $"/v1/ChargeLinks?meteringPointId={meteringPointId}";
            var list = new List<ChargeLinkV1Dto>
            {
                DtoFixture.Create<ChargeLinkV1Dto>(),
            };

            ApiClientMock
                .Setup(m => m.GetChargeLinksAsync(meteringPointId))
                .ReturnsAsync(list);

            // Act
            var actual = await Client.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetChargeLinksAsync_WhenMeteringPointIdHasNoChargeLink_ReturnsNotFound()
        {
            // Arrange
            var meteringPointId = "metering-point-has-no-links";
            var requestUrl = $"/v1/ChargeLinks?meteringPointId={meteringPointId}";
            var list = new List<ChargeLinkV1Dto>();

            ApiClientMock
                .Setup(m => m.GetChargeLinksAsync(meteringPointId))
                .ReturnsAsync(list);

            // Act
            var actual = await Client.GetAsync(requestUrl);

            // Arrange
            actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
