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

using GraphQL.Types;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class ActorDtoType : ObjectGraphType<Actor>
    {
        public ActorDtoType()
        {
            Name = "Actor";

            Field(x => x.Id).Description("The id of the actor.");
            Field(x => x.GlnOrEicNumber).Description("The gln or eic number of the actor.");
            Field(x => x.Name).Description("The name of the actor.");

            Field<NonNullGraphType<ListGraphType<NonNullGraphType<GridAreaType>>>>("gridAreas")
               .Resolve(x => x.Source.GridAreas)
               .Description("The grid areas the actor belongs to.");

            Field<EicFunctionEnum>("marketRole")
                .Resolve(x => x.Source.MarketRole)
                .Description("The market role of the actor.");

            Field<ActorStatusEnum>("status")
                .Resolve(x => x.Source.Status)
                .Description("The status of the actor.");

            // Below are commented out since the actor number is currently
            // the only field that market participant and wholesale have in common
            // AND it is also not currently possible to get actor information from
            // market participant based on actor number alone.

            // Field(x => x.ActorId).Description("The id of the actor.");
            // Field(x => x.ExternalActorId, nullable: true).Description("The external id of the actor.");
            // Field(x => x.Name).Description("The name of the actor.");
            // Field(x => x.Status).Description("The status of the actor.");
        }
    }
}
