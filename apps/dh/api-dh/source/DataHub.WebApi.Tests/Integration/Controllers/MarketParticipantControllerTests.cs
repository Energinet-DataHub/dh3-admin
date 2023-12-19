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
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon.AutoFixture.Attributes;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto;
using Energinet.DataHub.WebApi.Tests.Fixtures;
using Energinet.DataHub.WebApi.Tests.ServiceMocks;
using FluentAssertions;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public sealed class MarketParticipantControllerTests : ControllerTestsBase
    {
        public MarketParticipantControllerTests(
            BffWebApiFixture bffWebApiFixture,
            WebApiFactory factory,
            ITestOutputHelper testOutputHelper)
            : base(bffWebApiFixture, InstallServiceMock(factory), testOutputHelper)
        {
        }

        private const string GetFilteredActorsUrl = "v1/MarketParticipant/Organization/GetFilteredActors";

        [Theory]
        [InlineAutoMoqData]
        public async Task GetFilteredActors_NotFas_ReturnsSingleActor(OrganizationDto organization, ActorDto actor, Guid actorId)
        {
            // Arrange
            JwtAuthenticationServiceMock.AddAuthorizationHeader(BffClient, actorId);

            var organizations = new List<OrganizationDto>
            {
                organization,
            };

            var actors = new List<ActorDto>
            {
                new ActorDto()
                    {
                        ActorId = actorId,
                        OrganizationId = organization.OrganizationId,
                        ActorNumber = actor.ActorNumber,
                        MarketRoles = actor.MarketRoles,
                        Name = actor.Name,
                        Status = actor.Status,
                    },
            };

            var gridAreas = actor
                .MarketRoles
                .SelectMany(m => m.GridAreas)
                .Select(g => g.Id)
                .Distinct()
                .Select(gid => new GridAreaDto()
                    {
                        Id = gid,
                        Code = "000",
                        Name = string.Empty,
                        PriceAreaCode = "Dk1",
                        ValidFrom = DateTimeOffset.Now,
                        ValidTo = DateTimeOffset.Now,
                    });

            MarketParticipantClientMock
                .Setup(client => client.OrganizationGetAsync())
                .ReturnsAsync(organizations);

            MarketParticipantClientMock
                .Setup(client => client.ActorGetAsync())
                .ReturnsAsync(actors);

            MarketParticipantClientMock
                .Setup(client => client.GridAreaGetAsync())
                .ReturnsAsync((ICollection<GridAreaDto>)gridAreas);

            // Act
            var actual = await BffClient.GetAsync(GetFilteredActorsUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await actual.Content.ReadAsAsync<IEnumerable<FilteredActorDto>>();
            result.Should().ContainSingle(returnedActor => returnedActor.ActorId == actorId);
        }

        [Theory]
        [InlineAutoMoqData]
        public async Task GetFilteredActors_IsFas_ReturnsAllActors(OrganizationDto organization, ActorDto actor, Guid actorId)
        {
            // Arrange
            JwtAuthenticationServiceMock.AddAuthorizationHeader(BffClient, actorId, new Claim("membership", "fas"));

            var organizations = new List<OrganizationDto>
            {
                organization,
            };

            var actors = new List<ActorDto>
            {
                new ActorDto()
                    {
                        ActorId = actorId,
                        OrganizationId = organization.OrganizationId,
                        ActorNumber = actor.ActorNumber,
                        MarketRoles = actor.MarketRoles,
                        Name = actor.Name,
                        Status = actor.Status,
                    },
            };

            var gridAreas = actor
                .MarketRoles
                .SelectMany(m => m.GridAreas)
                .Select(g => g.Id)
                .Distinct()
                .Select(gid => new GridAreaDto()
                    {
                        Id = gid,
                        Code = "000",
                        Name = string.Empty,
                        PriceAreaCode = "Dk1",
                        ValidFrom = DateTimeOffset.Now,
                        ValidTo = DateTimeOffset.Now,
                    });

            MarketParticipantClientMock
                .Setup(client => client.OrganizationGetAsync())
                .ReturnsAsync(organizations);

            MarketParticipantClientMock
                .Setup(client => client.ActorGetAsync())
                .ReturnsAsync(actors);

            MarketParticipantClientMock
                .Setup(client => client.GridAreaGetAsync())
                .ReturnsAsync((ICollection<GridAreaDto>)gridAreas);

            // Act
            var actual = await BffClient.GetAsync(GetFilteredActorsUrl);

            // Assert
            actual.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await actual.Content.ReadAsAsync<IEnumerable<FilteredActorDto>>();
            var expected = actors.Select(x => x.ActorId);
            var actualIds = result.Select(r => r.ActorId);

            actualIds.Should().BeEquivalentTo(expected);
        }

        private static WebApiFactory InstallServiceMock(WebApiFactory webApiFactory)
        {
            webApiFactory.AddServiceMock(new JwtAuthenticationServiceMock());
            return webApiFactory;
        }
    }
}
