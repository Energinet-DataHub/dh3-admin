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

using Energinet.DataHub.MarketParticipant.Client.Models;
using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public sealed class UserRoleType : ObjectGraphType<UserRoleDto>
    {
        public UserRoleType()
        {
            Name = "UserRole";
            Field(x => x.Id).Description("The user role id.");
            Field(x => x.Name).Description("The user role name.");
            Field(x => x.Description).Description("The user role description");
            Field(x => x.EicFunction).Description("The EIC function the user role belongs to");
            Field(x => x.Status).Description("The user role status");
        }
    }
}
