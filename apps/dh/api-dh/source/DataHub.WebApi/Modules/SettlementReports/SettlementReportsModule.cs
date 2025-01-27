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

using Energinet.DataHub.WebApi.Clients.Wholesale.SettlementReports;
using Energinet.DataHub.WebApi.Common;
using Energinet.DataHub.WebApi.Extensions;
using Energinet.DataHub.WebApi.Options;
using Microsoft.Extensions.Options;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager;

public class SettlementReportsModule : IModule
{
    public IServiceCollection RegisterModule(
        IServiceCollection services,
        IConfiguration configuration) =>
        services.AddScoped<ISettlementReportsClient, SettlementReportsClient>(provider =>
        {
            var baseUrls = provider.GetRequiredService<IOptions<SubSystemBaseUrls>>().Value;
            var factory = provider.GetRequiredService<AuthorizedHttpClientFactory>();
            return new SettlementReportsClient(
                factory.CreateClient(baseUrls.WholesaleOrchestrationSettlementReportsBaseUrl),
                factory.CreateClient(baseUrls.WholesaleOrchestrationSettlementReportsLightBaseUrl),
                factory.CreateClient(baseUrls.SettlementReportsAPIBaseUrl));
        });
}
