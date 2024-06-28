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
import { NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { takeUntil } from 'rxjs';

import {
  DhAdminAssignableUserRolesStore,
  UserRoleItem,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

@Component({
  selector: 'dh-assignable-user-roles',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    FormsModule,
    RxLet,
    RxPush,
    TranslocoDirective,
    TranslocoPipe,
    MatDividerModule,

    WattEmptyStateComponent,
    WattSpinnerComponent,
    WATT_CARD,
    WATT_TABLE,
  ],
  styleUrls: ['./dh-assignable-user-roles.component.scss'],
  templateUrl: './dh-assignable-user-roles.component.html',
})
export class DhAssignableUserRolesComponent implements OnInit {
  private readonly assignableUserRolesStore = inject(DhAdminAssignableUserRolesStore);

  readonly assignableUserRoles$ = this.assignableUserRolesStore.assignableUserRoles$;
  readonly hasGeneralError$ = this.assignableUserRolesStore.hasGeneralError$;
  readonly dataSource = new WattTableDataSource<UserRoleItem>();

  @Output() readonly selectedUserRoles = new EventEmitter<UserRoleItem[]>();

  columns: WattTableColumnDef<UserRoleItem> = {
    name: { accessor: 'name' },
    description: { accessor: 'description', sort: false },
  };

  ngOnInit(): void {
    this.assignableUserRolesStore.assignableUserRoles$
      .pipe(takeUntil(this.assignableUserRolesStore.destroy$))
      .subscribe((userRoles) => (this.dataSource.data = userRoles));
  }

  selectionChanged(userRoles: UserRoleItem[]) {
    this.selectedUserRoles.emit(userRoles);
  }
}
