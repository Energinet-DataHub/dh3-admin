/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InjectionToken } from '@angular/core';

export class ActorStorage {
  private readonly selectedActorKey = 'actorStorage.selectedActor';

  private actorIds: string[] = [];

  constructor(private storage: Storage) {}

  setUserAssociatedActors = (actorIds: string[]) => (this.actorIds = actorIds);

  getSelectedActor = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const selected = this.storage.getItem(this.selectedActorKey);

    if (!selected || !this.actorIds.includes(selected)) {
      const defaultActor = this.actorIds[0];
      this.setSelectedActor(defaultActor);
      return defaultActor;
    }

    return selected;
  };

  setSelectedActor = (actorId: string) =>
    this.storage.setItem(this.selectedActorKey, actorId);
}

export const actorStorageToken = new InjectionToken<ActorStorage>(
  'actorStorageToken',
  {
    factory: (): ActorStorage => new ActorStorage(localStorage),
  }
);
