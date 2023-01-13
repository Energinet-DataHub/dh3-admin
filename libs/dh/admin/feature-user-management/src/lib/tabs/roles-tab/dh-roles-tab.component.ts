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
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { TranslocoModule } from '@ngneat/transloco';

import { WattCardModule } from '@energinet-datahub/watt/card';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';

import { DhRolesTabTableComponent } from './dh-roles-tab-table.component';
import { Router } from '@angular/router';
import {
  dhAdminPath,
  dhAdminUserManagementPath,
  dhAdminUserRoleManagementCreatePath,
} from '@energinet-datahub/dh/admin/routing';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { DhRolesTabListFilterComponent } from './dh-roles-tab-list-filter.component';
import { DhTabDataGeneralErrorComponent } from '../general-error/dh-tab-data-general-error.component';
import { DhAdminUserRolesManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { LetModule, PushModule } from '@rx-angular/template';
import {
  EicFunction,
  UserRoleDto,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';

@Component({
  selector: 'dh-roles-tab',
  templateUrl: './dh-roles-tab.component.html',
  styleUrls: ['./dh-roles-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore),
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    WattCardModule,
    WattSpinnerModule,
    PushModule,
    DhRolesTabTableComponent,
    DhSharedUiPaginatorComponent,
    WattButtonModule,
    DhRolesTabListFilterComponent,
    DhTabDataGeneralErrorComponent,
    LetModule,
  ],
})
export class DhUserRolesTabComponent {
  @Input() roles: UserRoleDto[] = [];
  constructor(private router: Router) {}

  private readonly store = inject(DhAdminUserRolesManagementDataAccessApiStore);
  roles$ = this.store.rolesFiltered$;

  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  updateFilterStatus(status: UserRoleStatus | null) {
    this.store.setFilterStatus(status);
  }

  updateFilterEicFunction(eicFunctions: EicFunction[] | null) {
    this.store.setFilterEicFunction(eicFunctions);
  }

  reloadRoles(): void {
    this.store.getRoles();
  }

  readonly createUserRole = () => {
    const url = this.router.createUrlTree([
      dhAdminPath,
      dhAdminUserManagementPath,
      dhAdminUserRoleManagementCreatePath,
    ]);

    this.router.navigateByUrl(url);
  };
}
