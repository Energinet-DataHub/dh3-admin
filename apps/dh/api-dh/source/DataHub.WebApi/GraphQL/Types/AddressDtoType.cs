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
    public class AddressDtoType : ObjectGraphType<AddressDto>
    {
        public AddressDtoType()
        {
            Name = "Address";
            Field(x => x.City).Description("The city of the address.");
            Field(x => x.Country).Description("The country of the address.");
            Field(x => x.Number).Description("The number of the address.");
            Field(x => x.StreetName).Description("The street name of the address.");
            Field(x => x.ZipCode).Description("The zip code of the address.");
        }
    }
}
