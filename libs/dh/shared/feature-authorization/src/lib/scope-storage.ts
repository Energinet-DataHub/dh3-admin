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

export class ScopeStorage {
  constructor(private localStorage: Storage) {}

  public length = 0;

  public readonly setItem = (key: string, value: string) => {
    this.localStorage.setItem(key, value);
    this.length = this.localStorage.length;
  };

  public readonly getItem = (key: string) => {
    return this.localStorage.getItem(key);
  };

  public readonly removeItem = (key: string) => {
    this.localStorage.removeItem(key);
    this.length = this.localStorage.length;
  };

  public readonly key = (index: number) => {
    return this.localStorage.key(index);
  };
}

export const scopeStorageToken = new InjectionToken<ScopeStorage>(
  'scopeStorageToken',
  {
    factory: (): ScopeStorage => new ScopeStorage(localStorage),
  }
);
