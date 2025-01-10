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

using System.Web;
using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.GraphQL.Mutation;

public partial class Mutation
{
    [Error(typeof(ApiException))]
    public async Task<string> AddTokenToDownloadUrlAsync(
        Uri downloadUrl,
        [Service] IMarketParticipantClient_V1 client)
    {
        var token = await client.CreateDownloadTokenAsync();

        var uriBuilder = new UriBuilder(downloadUrl);
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        query["token"] = token.ToString();
        uriBuilder.Query = query.ToString();
        return uriBuilder.Uri.ToString();
    }
}
