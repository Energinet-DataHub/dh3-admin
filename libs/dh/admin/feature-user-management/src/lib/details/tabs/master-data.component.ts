//#region License
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
//#endregion
import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhUser } from '@energinet-datahub/dh/admin/shared';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-user-master-data',
  standalone: true,
  templateUrl: './master-data.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [
    TranslocoDirective,

    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
  ],
})
export class DhUserMasterDataComponent {
  user = input.required<DhUser>();
}
