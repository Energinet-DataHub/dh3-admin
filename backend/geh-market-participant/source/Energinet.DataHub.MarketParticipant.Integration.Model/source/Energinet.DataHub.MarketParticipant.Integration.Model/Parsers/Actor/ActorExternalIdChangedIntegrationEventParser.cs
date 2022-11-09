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
using Energinet.DataHub.MarketParticipant.Integration.Model.Dtos;
using Energinet.DataHub.MarketParticipant.Integration.Model.Exceptions;
using Energinet.DataHub.MarketParticipant.Integration.Model.Protobuf;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using Enum = System.Enum;

namespace Energinet.DataHub.MarketParticipant.Integration.Model.Parsers.Actor
{
    public sealed class ActorExternalIdChangedIntegrationEventParser : IActorExternalIdChangedIntegrationEventParser
    {
        public byte[] ParseToSharedIntegrationEvent(ActorExternalIdChangedIntegrationEvent integrationEvent)
        {
            try
            {
                ArgumentNullException.ThrowIfNull(integrationEvent, nameof(integrationEvent));
                var eventContract = MapEvent(integrationEvent);
                var contract = new SharedIntegrationEventContract { ActorExternalIdChangedIntegrationEvent = eventContract };
                return contract.ToByteArray();
            }
            catch (Exception ex)
            {
                throw new MarketParticipantException($"Error parsing {nameof(ActorExternalIdChangedIntegrationEvent)}", ex);
            }
        }

        internal static ActorExternalIdChangedIntegrationEvent Parse(ActorExternalIdChangedIntegrationEventContract protoContract)
        {
            return MapContract(protoContract);
        }

        private static ActorExternalIdChangedIntegrationEvent MapContract(ActorExternalIdChangedIntegrationEventContract contract)
        {
            Guid? externalActorId = Guid.TryParse(contract.ExternalActorId, out var id)
                ? id
                : null;

            var integrationEvent = new ActorExternalIdChangedIntegrationEvent(
                Guid.Parse(contract.Id),
                contract.EventCreated.ToDateTime(),
                Guid.Parse(contract.ActorId),
                Guid.Parse(contract.OrganizationId),
                externalActorId);

            if (integrationEvent.Type != contract.Type)
            {
                throw new FormatException("Invalid Type");
            }

            return integrationEvent;
        }

        private static ActorExternalIdChangedIntegrationEventContract MapEvent(
            ActorExternalIdChangedIntegrationEvent integrationEvent)
        {
            var contract = new ActorExternalIdChangedIntegrationEventContract
            {
                Id = integrationEvent.Id.ToString(),
                EventCreated = Timestamp.FromDateTime(integrationEvent.EventCreated),
                ActorId = integrationEvent.ActorId.ToString(),
                OrganizationId = integrationEvent.OrganizationId.ToString(),
                Type = integrationEvent.Type
            };

            if (integrationEvent.ExternalActorId.HasValue)
            {
                contract.ExternalActorId = integrationEvent.ExternalActorId.ToString();
            }

            return contract;
        }
    }
}
