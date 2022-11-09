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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.GridArea;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Services
{
    public sealed class GridAreaNameChangedEventDispatcher : EventDispatcherBase
    {
        private readonly IGridAreaNameChangedIntegrationEventParser _eventParser;

        public GridAreaNameChangedEventDispatcher(
            IGridAreaNameChangedIntegrationEventParser eventParser,
            IMarketParticipantServiceBusClient serviceBusClient)
            : base(serviceBusClient)
        {
            _eventParser = eventParser;
        }

        public override async Task<bool> TryDispatchAsync(IIntegrationEvent integrationEvent)
        {
            ArgumentNullException.ThrowIfNull(integrationEvent);

            if (integrationEvent is not Domain.Model.IntegrationEvents.GridAreaIntegrationEvents.GridAreaNameChangedIntegrationEvent gridAreaUpdatedIntegrationEvent)
                return false;

            var outboundIntegrationEvent = new GridAreaNameChangedIntegrationEvent(
                gridAreaUpdatedIntegrationEvent.Id,
                gridAreaUpdatedIntegrationEvent.EventCreated,
                gridAreaUpdatedIntegrationEvent.GridAreaId.Value,
                gridAreaUpdatedIntegrationEvent.Name.Value);

            var bytes = _eventParser.ParseToSharedIntegrationEvent(outboundIntegrationEvent);
            await DispatchAsync(outboundIntegrationEvent, bytes).ConfigureAwait(false);

            return true;
        }
    }
}
