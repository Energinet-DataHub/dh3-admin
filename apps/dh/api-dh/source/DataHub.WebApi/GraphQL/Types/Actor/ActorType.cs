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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;
using Energinet.DataHub.WebApi.GraphQL.Enums;
using Energinet.DataHub.WebApi.GraphQL.Resolvers;

namespace Energinet.DataHub.WebApi.GraphQL.Types.Actor;

public class ActorType : ObjectType<ActorDto>
{
    protected override void Configure(IObjectTypeDescriptor<ActorDto> descriptor)
    {
        descriptor.Name("Actor");

        descriptor.Field(f => f.ActorId).Name("id");
        descriptor.Field(f => f.Name.Value).Name("name");

        descriptor.Field("Test")
            .Type<NonNullType<StringType>>()
            .Resolve("Test");

        descriptor
            .Ignore(f => f.ActorNumber)
            .Field(f => f.ActorNumber.Value)
            .Name("glnOrEicNumber");

        descriptor
           .Field("displayName")
           .Type<NonNullType<StringType>>()
           .Resolve(context => context.Parent<ActorDto>() switch
           {
               null => string.Empty,
               var actor when string.IsNullOrWhiteSpace(actor.MarketRoles.FirstOrDefault()?.EicFunction.ToString()) => actor.Name.Value,
               var actor => $"{actor.MarketRoles.FirstOrDefault()?.EicFunction.ToString()} • {actor.Name.Value}",
           });

        descriptor
            .Field(f => f.MarketRoles)
            .Name("marketRole")
            .Resolve(context =>
                context.Parent<ActorDto>().MarketRoles.FirstOrDefault()?.EicFunction);

        descriptor
            .Field("userRoles")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetActorsRolesAsync(default!, default!, default!));

        descriptor
            .Field(f => f.Status)
            .Name("status")
            .Resolve(context =>
                Enum.Parse<ActorStatus>(context.Parent<ActorDto>().Status));

        descriptor
            .Field("gridAreas")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetGridAreasAsync(default!, default!));

        descriptor
            .Field("contact")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetContactAsync(default!, default!));

        descriptor
            .Field(f => f.OrganizationId)
            .Name("organization")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetOrganizationAsync(default!, default!));

        descriptor
            .Field("balanceResponsibleAgreements")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetBalanceResponsibleAgreementsAsync(default!, default!));

        descriptor
            .Field("credentials")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetActorCredentialsAsync(default!, default!));

        descriptor
            .Field("publicMail")
            .ResolveWith<MarketParticipantResolvers>(c => c.GetActorPublicMailAsync(default!, default!));
    }
}
