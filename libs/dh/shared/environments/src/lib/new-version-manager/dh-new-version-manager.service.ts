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
import { inject, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

import { WattToastService } from '@energinet-datahub/watt/toast';

@Injectable({
  providedIn: 'root',
})
export class DhNewVersionManager {
  private readonly swUpdate = inject(SwUpdate);
  private readonly toast = inject(WattToastService);

  init() {
    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe((event) => {
        console.log('Version ready event', event);

        this.toast.open({
          type: 'info',
          message: 'A new version is available. Click to update.',
          actionLabel: 'Reload',
          action: () => window.location.reload(),
          duration: 1000 * 60 * 60,
        });
      });
  }
}
