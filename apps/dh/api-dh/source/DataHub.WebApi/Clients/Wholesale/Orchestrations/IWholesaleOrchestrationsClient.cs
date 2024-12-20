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

using Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations.Dto;

namespace Energinet.DataHub.WebApi.Clients.Wholesale.Orchestrations;

/// <summary>
/// Interface of client for working with the Wholesale Orchestrations API.
/// </summary>
public interface IWholesaleOrchestrationsClient
{
    /// <summary>
    /// Start a calculation and return its id.
    /// </summary>
    public Task<Guid> StartCalculationAsync(StartCalculationRequestDto requestDto, CancellationToken cancellationToken);

    /// <summary>
    /// Cancel a scheduled calculation. Throws an exception if the calculation is already started.
    /// </summary>
    public Task CancelScheduledCalculationAsync(CancelScheduledCalculationRequestDto requestDto, CancellationToken cancellationToken);
}
