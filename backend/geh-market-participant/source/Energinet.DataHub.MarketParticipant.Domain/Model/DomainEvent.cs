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
using Energinet.DataHub.MarketParticipant.Domain.Model.IntegrationEvents;

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    public sealed class DomainEvent
    {
        public DomainEvent(Guid domainObjectId, string domainObjectType, IIntegrationEvent integrationEvent)
        {
            DomainObjectId = domainObjectId;
            DomainObjectType = domainObjectType;
            IntegrationEvent = integrationEvent;
        }

        public DomainEvent(DomainEventId id, Guid domainObjectId, string domainObjectType, bool isSent, IIntegrationEvent integrationEvent)
            : this(domainObjectId, domainObjectType, integrationEvent)
        {
            Id = id;
            IsSent = isSent;
        }

        public DomainEventId Id { get; } = new DomainEventId(0);
        public Guid DomainObjectId { get; }
        public string DomainObjectType { get; }
        public bool IsSent { get; private set; }
        public IIntegrationEvent IntegrationEvent { get; }

        public void MarkAsSent()
        {
            IsSent = true;
        }
    }
}
