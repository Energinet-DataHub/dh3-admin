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

using Energinet.DataHub.WebApi.Clients.MarketParticipant.v1;

namespace Energinet.DataHub.WebApi.GraphQL.DataLoaders;

public class ActorNameByMarketRoleDataLoader : BatchDataLoader<(string ActorNumber, EicFunction EicFunction), ActorNameDto?>
{
    private readonly IMarketParticipantClient_V1 _client;

    public ActorNameByMarketRoleDataLoader(
        IMarketParticipantClient_V1 client,
        IBatchScheduler batchScheduler,
        DataLoaderOptions options)
        : base(batchScheduler, options) =>
        _client = client;

    protected override async Task<IReadOnlyDictionary<(string ActorNumber, EicFunction EicFunction), ActorNameDto?>>
        LoadBatchAsync(IReadOnlyList<(string ActorNumber, EicFunction EicFunction)> keys, CancellationToken cancellationToken)
    {
        var actorNumbers = keys.Select(x => x.ActorNumber).ToHashSet();

        var actors = await _client.ActorGetAsync(cancellationToken).ConfigureAwait(false);
        var dictionary = new Dictionary<(string, EicFunction), ActorNameDto?>();

        foreach (var actor in actors.Where(x => actorNumbers.Contains(x.ActorNumber.Value)))
        {
            dictionary.TryAdd((actor.ActorNumber.Value, actor.MarketRole.EicFunction), actor.Name);
        }

        return dictionary;
    }
}
