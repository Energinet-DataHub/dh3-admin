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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideComponentStore } from '@ngrx/component-store';
import { LetModule, PushModule } from '@rx-angular/template';
import { PageEvent } from '@angular/material/paginator';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { DhAdminUserManagementDataAccessApiStore } from '@energinet-datahub/dh/admin/data-access-api';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattCardModule } from '@energinet-datahub/watt/card';

import { DhUsersTabGeneralErrorComponent } from './general-error/dh-users-tab-general-error.component';
import { DhUsersTabTableComponent } from './dh-users-tab-table.component';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import {
  WattDropdownModule,
  WattDropdownOption,
} from '@energinet-datahub/watt/dropdown';
import { FormsModule } from '@angular/forms';
import { DhUsersTabSearchComponent } from './dh-users-tab-search.component';
import { UserStatus } from '@energinet-datahub/dh/shared/domain';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dh-users-tab',
  standalone: true,
  templateUrl: './dh-users-tab.component.html',
  styles: [
    `
      :host {
        display: block;
        /* TODO: Add spacing variable for 24px */
        margin: 24px var(--watt-space-s);
      }

      .filter-container {
        display: inline-flex;
        gap: var(--watt-space-m);
      }

      .users-overview {
        &__spinner {
          display: flex;
          justify-content: center;
          padding: var(--watt-space-l) 0;
        }

        &__error {
          padding: var(--watt-space-xl) 0;
        }
      }

      h4 {
        margin: 0;
      }

      .card-title__container {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
  providers: [provideComponentStore(DhAdminUserManagementDataAccessApiStore)],
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    FormsModule,
    TranslocoModule,
    WattSpinnerModule,
    WattCardModule,
    WattFormFieldModule,
    WattDropdownModule,
    DhUsersTabTableComponent,
    DhUsersTabSearchComponent,
    DhSharedUiPaginatorComponent,
    DhUsersTabGeneralErrorComponent,
  ],
})
export class DhUsersTabComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  readonly users$ = this.store.users$;
  readonly totalUserCount$ = this.store.totalUserCount$;

  readonly pageIndex$ = this.store.paginatorPageIndex$;
  readonly pageSize$ = this.store.pageSize$;

  readonly isLoading$ = this.store.isLoading$;
  readonly hasGeneralError$ = this.store.hasGeneralError$;

  filter = this.store.filter;
  userStatusOptions: WattDropdownOption[] = [];

  constructor(
    private store: DhAdminUserManagementDataAccessApiStore,
    private trans: TranslocoService
  ) {}

  ngOnInit() {
    this.buildUserStatusOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private buildUserStatusOptions() {
    this.trans
      .selectTranslateObject('admin.userManagement.userStatus')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (keys) => {
          this.userStatusOptions = Object.keys(UserStatus).map((entry) => {
            return {
              value: entry,
              displayValue: keys[entry.toLowerCase()],
            };
          });
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.store.updatePageMetadata({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  onSearch(value: string): void {
    this.store.filter.searchText = value;
    this.reloadUsers();
  }

  reloadUsers(): void {
    this.store.reloadUsers();
  }
}
