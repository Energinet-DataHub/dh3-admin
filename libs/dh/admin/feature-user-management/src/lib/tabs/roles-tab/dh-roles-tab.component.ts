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
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { translate, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhAdminUserRolesManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import {
  MarketParticipantEicFunction,
  MarketParticipantUserRoleDto,
  MarketParticipantUserRoleStatus,
} from '@energinet-datahub/dh/shared/domain';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhCreateUserRoleModalComponent } from '@energinet-datahub/dh/admin/feature-create-user-role';
import { WATT_MODAL } from '@energinet-datahub/watt/modal';
import { exportCsv } from '@energinet-datahub/dh/shared/ui-util';

import { DhRolesTabTableComponent } from './dh-roles-tab-table.component';
import { DhRolesTabListFilterComponent } from './dh-roles-tab-list-filter.component';
import { DhTabDataGeneralErrorComponent } from '../general-error/dh-tab-data-general-error.component';

@Component({
  selector: 'dh-roles-tab',
  templateUrl: './dh-roles-tab.component.html',
  styleUrls: ['./dh-roles-tab.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(DhAdminUserRolesManagementDataAccessApiStore)],
  imports: [
    CommonModule,
    TranslocoModule,
    WattButtonComponent,
    WATT_CARD,
    WattSpinnerComponent,
    RxPush,
    DhRolesTabTableComponent,
    DhSharedUiPaginatorComponent,
    DhRolesTabListFilterComponent,
    DhTabDataGeneralErrorComponent,
    RxLet,
    DhPermissionRequiredDirective,
    DhCreateUserRoleModalComponent,
    WATT_MODAL,
  ],
})
export class DhUserRolesTabComponent {
  @Input() roles: MarketParticipantUserRoleDto[] = [];

  private readonly store = inject(DhAdminUserRolesManagementDataAccessApiStore);
  private readonly trans = inject(TranslocoService);

  roles$ = this.store.rolesFiltered$;
  isLoading$ = this.store.isLoading$;
  hasGeneralError$ = this.store.hasGeneralError$;

  isCreateUserRoleModalVisible = false;

  updateFilterStatus(status: MarketParticipantUserRoleStatus | null) {
    this.store.setFilterStatus(status);
  }

  updateFilterEicFunction(eicFunctions: MarketParticipantEicFunction[] | null) {
    this.store.setFilterEicFunction(eicFunctions);
  }

  updateSearchTerm(searchTerm: string | null) {
    this.store.setSearchTerm(searchTerm);
  }

  reloadRoles(): void {
    this.store.getRoles();
  }

  modalOnClose({ saveSuccess }: { saveSuccess: boolean }): void {
    this.isCreateUserRoleModalVisible = false;

    if (saveSuccess) {
      this.reloadRoles();
    }
  }

  async download(roles: MarketParticipantUserRoleDto[]) {
    this.trans
      .selectTranslateObject('marketParticipant.marketRoles')
      .pipe(take(1))
      .subscribe((rolesTranslations) => {
        const basePath = 'admin.userManagement.tabs.roles.table.columns.';

        const headers = [
          `"${translate(basePath + 'name')}"`,
          `"${translate(basePath + 'marketRole')}"`,
          `"${translate(basePath + 'status')}"`,
        ];

        const lines = roles.map((x) => [
          `"${x.name}"`,
          `"${rolesTranslations[x.eicFunction]}"`,
          `"${x.status}"`,
        ]);

        exportCsv(headers, lines);
      });
  }
}
