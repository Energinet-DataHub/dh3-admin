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
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';

import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';

import { DhCreateUserrolePermissionsTabComponent } from './dh-create-userrole-permissions-tab.component';

@Component({
  selector: 'dh-create-userrole-permissions-tab-container',
  standalone: true,
  templateUrl: './dh-create-userrole-permissions-tab-container.component.html',
  styles: [
    `
      :host {
        background-color: var(--watt-color-neutral-white);
        display: block;
      }

      .create-overview {
        &__spinner {
          display: flex;
          justify-content: center;
          padding: var(--watt-space-l) 0;
        }

        &__error {
          padding: var(--watt-space-xl) 0;
        }
      }
    `,
  ],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    WattSpinnerModule,
    DhCreateUserrolePermissionsTabComponent,
  ],
})
export class DhCreateUserrolePermissionsTabContainerComponent {}
