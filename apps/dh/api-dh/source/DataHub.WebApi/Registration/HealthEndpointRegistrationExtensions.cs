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

using Energinet.DataHub.Core.App.Common.Extensions.Builder;

namespace Energinet.DataHub.WebApi.Registration;

public static class HealthEndpointRegistrationExtensions
{
    public static void SetupHealthEndpoints(this IServiceCollection services, ApiClientSettings settings) =>
        services
            .AddHealthChecks()
            .AddLiveCheck()
            .AddServiceHealthCheck("marketParticipant", CreateHealthEndpointUri(settings.MarketParticipantBaseUrl))
            .AddServiceHealthCheck("wholesale", CreateHealthEndpointUri(settings.WholesaleBaseUrl))
            .AddServiceHealthCheck("wholesaleOrchestrations", CreateHealthEndpointUri(settings.WholesaleOrchestrationsBaseUrl, isAzureFunction: true))
            .AddServiceHealthCheck("eSettExchange", CreateHealthEndpointUri(settings.ESettExchangeBaseUrl))
            .AddServiceHealthCheck("settlementReportsAPI", CreateHealthEndpointUri(settings.SettlementReportsAPIBaseUrl))
            .AddServiceHealthCheck("ediB2CWebApi", CreateHealthEndpointUri(settings.EdiB2CWebApiBaseUrl))
            .AddServiceHealthCheck("notificationsWebApi", CreateHealthEndpointUri(settings.NotificationsBaseUrl))
            .AddServiceHealthCheck("dh2BridgeWebApi", CreateHealthEndpointUri(settings.Dh2BridgeBaseUrl));

    internal static Uri CreateHealthEndpointUri(string baseUri, bool isAzureFunction = false)
    {
        var liveEndpoint = "/monitor/live";
        if (isAzureFunction)
        {
            liveEndpoint = "/api" + liveEndpoint;
        }

        return string.IsNullOrWhiteSpace(baseUri)
            ? new Uri("https://empty")
            : new Uri(baseUri + liveEndpoint);
    }
}
