// Copyright 2020 Energinet DataHub A/S
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
using System.Threading;
using System.Threading.Tasks;
using Energinet.DataHub.WebApi.Clients.Wholesale.v3;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Tests.Extensions;
using Energinet.DataHub.WebApi.Tests.Mocks;
using Energinet.DataHub.WebApi.Tests.TestServices;
using HotChocolate.Execution;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.GraphQL.Calculation;

public class CalculationStatusTypeQueryTests
{
    private static readonly Guid _calculationId = new("9cce3e8f-b56d-49f8-a6af-42cc6dc3246f");

    private static readonly string _calculationByIdQuery =
    $$"""
    {
      calculationById(id: "{{_calculationId}}") {
        id
        statusType
      }
    }
    """;

    [Theory]
    [InlineData(CalculationOrchestrationState.Scheduled)]
    [InlineData(CalculationOrchestrationState.Calculating)]
    [InlineData(CalculationOrchestrationState.CalculationFailed)]
    [InlineData(CalculationOrchestrationState.Calculated)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueuing)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueuingFailed)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueued)]
    [InlineData(CalculationOrchestrationState.Completed)]
    public async Task GetCalculationStatusTypeAsync(CalculationOrchestrationState orchestrationState)
    {
        var server = new GraphQLTestService();

        server.WholesaleClientV3Mock
            .Setup(x => x.GetCalculationAsync(_calculationId, default))
            .ReturnsAsync(new CalculationDto()
            {
                CalculationId = _calculationId,
                OrchestrationState = orchestrationState,
            });

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationByIdQuery)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync($"{orchestrationState}");
    }

    [Theory]
    [InlineData(CalculationOrchestrationState.Scheduled)]
    [InlineData(CalculationOrchestrationState.Calculating)]
    [InlineData(CalculationOrchestrationState.CalculationFailed)]
    [InlineData(CalculationOrchestrationState.Calculated)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueuing)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueuingFailed)]
    [InlineData(CalculationOrchestrationState.ActorMessagesEnqueued)]
    [InlineData(CalculationOrchestrationState.Completed)]
    public async Task GetCalculationStatusTypeAsync_UseProcessManagerFeature(CalculationOrchestrationState orchestrationState)
    {
        var server = new GraphQLTestService();

        server.FeatureManagerMock
            .Setup(x => x.IsEnabledAsync(nameof(FeatureFlags.Names.UseProcessManager)))
            .ReturnsAsync(true);

        server.ProcessManagerCalculationClientMock
            .Setup(x => x.GetCalculationAsync(_calculationId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new CalculationDto()
            {
                CalculationId = _calculationId,
                OrchestrationState = orchestrationState,
            });

        var result = await server.ExecuteRequestAsync(b => b
            .SetDocument(_calculationByIdQuery)
            .SetUser(ClaimsPrincipalMocks.CreateAdministrator()));

        await result.MatchSnapshotAsync($"{orchestrationState}_processmanager");
    }
}
