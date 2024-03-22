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
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using NodaTime;

namespace Energinet.DataHub.WebApi.GraphQL;

public sealed class ProcessDelegation
{
    public Guid Id { get; set; } = default!;

    public Guid PeriodId { get; set; } = default!;

    public Guid DelegatedBy { get; set; } = default!;

    public Guid DelegatedTo { get; set; } = default!;

    public Guid GridAreaId { get; set; } = default!;

    public DelegatedProcess Process { get; set; } = default!;

    public Interval ValidPeriod { get; set; } = default!;
}
