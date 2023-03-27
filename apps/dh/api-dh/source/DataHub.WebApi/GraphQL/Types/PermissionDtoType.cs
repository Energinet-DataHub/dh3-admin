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

using Energinet.DataHub.MarketParticipant.Client;
using Energinet.DataHub.MarketParticipant.Client.Models;
using GraphQL.MicrosoftDI;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class PermissionDtoType : ObjectGraphType<PermissionDetailsDto>
    {
        public PermissionDtoType()
        {
            Name = "Permission";
            Field(x => x.Id).Description("The ID of the permission.");
            Field(x => x.Name).Description("The name of the permission.");
            Field(x => x.Description).Description("The description of the permission.");
            Field(x => x.Created).Description("The created date of the permission.");
            Field(x => x.AssignableTo).Description("The EIC functions this permission is assignable to.");

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<UserRoleType>>>>("userRoles")
               .Resolve()
               .WithScope()
               .WithService<IMarketParticipantUserRoleClient>()
               .ResolveAsync(async (context, client) =>
               {
                   var userRoles = await client.GetAssignedToPermissionAsync(context.Source.Id);
                   return userRoles;
               });
        }
    }
}
