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
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DhNavigationService } from '@energinet-datahub/dh/shared/navigation';

import { DhUsersComponent } from './table/table.component';
import { DhInviteUserComponent } from './invite/invite.component';

@Component({
  standalone: true,
  selector: 'dh-user-management',
  providers: [DhNavigationService],
  template: `
    <dh-invite-user #invite />
    <dh-users (open)="navigate($event.id)" (invite)="invite.open()" />
    <router-outlet />
  `,
  imports: [DhUsersComponent, DhInviteUserComponent, RouterOutlet],
})
export class DhUserManagementComponent {
  private navigationService = inject(DhNavigationService);

  navigate(id: string) {
    this.navigationService.navigate('details', id);
  }
}
