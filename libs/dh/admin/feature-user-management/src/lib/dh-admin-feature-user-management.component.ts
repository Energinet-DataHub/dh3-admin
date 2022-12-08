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

import { DhUserManagementTabsComponent } from './user-management-tabs/dh-user-management-tabs.component';

@Component({
  selector: 'dh-admin-feature-user-management',
  template: `<dh-user-management-tabs></dh-user-management-tabs>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  standalone: true,
  imports: [DhUserManagementTabsComponent],
})
export class DhAdminFeatureUserManagementComponent {}
