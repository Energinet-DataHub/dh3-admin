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

using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_026.V1.Model;
using Energinet.DataHub.ProcessManager.Orchestrations.Abstractions.Processes.BRS_028.V1.Model;

namespace Energinet.DataHub.WebApi.Modules.ProcessManager.Requests.Types;

[OneOf]
public record RequestInput(
    RequestCalculatedEnergyTimeSeriesInputV1 RequestCalculatedEnergyTimeSeries,
    RequestCalculatedWholesaleServicesInputV1? RequestCalculatedWholesaleServices);
