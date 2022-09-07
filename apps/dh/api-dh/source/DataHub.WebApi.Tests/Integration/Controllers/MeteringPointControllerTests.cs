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

using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AutoFixture;
using Energinet.DataHub.MeteringPoints.Client.Abstractions;
using Energinet.DataHub.MeteringPoints.Client.Abstractions.Models;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;
using Xunit.Abstractions;
using Xunit.Categories;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    [IntegrationTest]
    public class MeteringPointControllerTests :
        WebApiTestBase<BffWebApiFixture>,
        IClassFixture<BffWebApiFixture>,
        IClassFixture<WebApiFactory>,
        IAsyncLifetime
    {
        private Fixture DtoFixture { get; }

        private Mock<IMeteringPointClient> ApiClientMock { get; }

        private readonly HttpClient _client;

        public MeteringPointControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, testOutputHelper)
        {
            DtoFixture = new Fixture();

            ApiClientMock = new Mock<IMeteringPointClient>();
            _client = factory.WithWebHostBuilder(builder =>
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
            _client.DefaultRequestHeaders.Add("Authorization", $"Bearer xxx");
            return Task.CompletedTask;
        }

        public Task DisposeAsync()
        {
            _client.Dispose();
            return Task.CompletedTask;
        }

        [Fact]
        public async Task When_MeteringPoint_Requested_And_Found_Then_StatusCode_IsOK()
        {
            // Arrange
            const string gsrn = "existing-gsrn-number";
            var requestUrl = $"/v1/MeteringPoint/GetByGsrn?gsrnNumber={gsrn}";
            var meteringPointDto = DtoFixture.Create<MeteringPointCimDto>();

            ApiClientMock
                .Setup(mock => mock.GetMeteringPointByGsrnAsync(gsrn))
                .ReturnsAsync(meteringPointDto);

            // Act
            var actual = await _client.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task When_MeteringPoint_Requested_And_Not_Found_Then_StatusCode_IsNotFound()
        {
            // Arrange
            const string gsrn = "non-existing-gsrn-number";
            var requestUrl = $"/v1/meteringpoint/getbygsrn?gsrnNumber={gsrn}";

            ApiClientMock
                .Setup(mock => mock.GetMeteringPointByGsrnAsync(gsrn))
                .Returns(Task.FromResult<MeteringPointCimDto?>(null));

            // Act
            var actual = await _client.GetAsync(requestUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
