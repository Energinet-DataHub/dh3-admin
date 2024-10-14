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

using System.Reactive.Linq;
using Energinet.DataHub.WebApi.Clients.Notifications;

namespace Energinet.DataHub.WebApi.GraphQL.Subscription;

public partial class Subscription
{
    public IObservable<Notification> OnNotificationAddedAsync(
        [Service] INotificationsClient notificationsClient,
        CancellationToken cancellationToken)
    {
       return Observable
            .Interval(TimeSpan.FromSeconds(60))
            .SelectMany(_ => Observable
                .FromAsync(() => notificationsClient.GetUnreadNotificationsAsync(cancellationToken))
                .SelectMany(notification => notification));
    }

    [Subscribe(With = nameof(OnNotificationAddedAsync))]
    public Notification NotificationAdded([EventMessage] Notification notification) =>
        notification;
}
