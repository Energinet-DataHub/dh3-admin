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
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';

import { switchMap } from 'rxjs';
import { translate, TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattSearchComponent } from '@energinet-datahub/watt/search';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';

import { exportToCSV, streamToFile } from '@energinet-datahub/dh/shared/ui-util';

import { query } from '@energinet-datahub/dh/shared/util-apollo';
import { PermissionDto } from '@energinet-datahub/dh/shared/domain';
import { GetPermissionsDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

import { DhAdminPermissionDetailComponent } from '../details/dh-admin-permission-detail.component';

@Component({
  selector: 'dh-admin-permission-overview',
  standalone: true,
  templateUrl: './dh-admin-permission-overview.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }
    `,
  ],
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_CARD,
    WATT_TABLE,
    WattSearchComponent,
    WattButtonComponent,
    WattEmptyStateComponent,

    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
    VaterUtilityDirective,

    DhPermissionRequiredDirective,
    DhAdminPermissionDetailComponent,
  ],
})
export class DhAdminPermissionOverviewComponent {
  private readonly toastService = inject(WattToastService);
  private readonly httpClient = inject(HttpClient);

  query = query(GetPermissionsDocument, { variables: { searchTerm: '' } });
  loading = this.query.loading;
  hasError = computed(() => this.query.error() !== undefined);

  columns: WattTableColumnDef<PermissionDto> = {
    name: { accessor: 'name' },
    description: { accessor: 'description' },
  };

  dataSource = new WattTableDataSource<PermissionDto>([]);
  activeRow: PermissionDto | undefined = undefined;

  url = signal<string>('');

  permissionDetail = viewChild.required(DhAdminPermissionDetailComponent);

  constructor() {
    effect(
      () => {
        const data = this.query.data();
        this.dataSource.data = data?.permissions.permissions ?? [];
        this.url.set(data?.permissions?.getPermissionRelationsUrl ?? '');
      },
      { allowSignalWrites: true }
    );
  }

  onRowClick(row: PermissionDto): void {
    this.activeRow = row;
    this.permissionDetail().open(row);
  }

  onClosed(): void {
    this.activeRow = undefined;
  }

  onSearch(value: string): void {
    this.dataSource.filter = value;
  }

  refresh(): void {
    this.query.refetch({ searchTerm: '' });
  }

  exportAsCsv(): void {
    if (this.dataSource.sort) {
      const basePath = 'admin.userManagement.permissionsTab.';
      const headers = [
        `"${translate(basePath + 'permissionName')}"`,
        `"${translate(basePath + 'permissionDescription')}"`,
      ];

      const marketRoles = this.dataSource.sortData(
        [...this.dataSource.filteredData],
        this.dataSource.sort
      );

      const lines = marketRoles.map((x) => [`"${x.name}"`, `"${x.description}"`]);

      exportToCSV({ headers, lines });
    }
  }

  downloadRelationCSV(url: string) {
    this.toastService.open({
      type: 'loading',
      message: translate('shared.downloadStart'),
    });

    const fileOptions = {
      name: 'permissions-relation-report',
      type: 'text/csv',
    };

    this.httpClient
      .get(url, { responseType: 'text' })
      .pipe(switchMap(streamToFile(fileOptions)))
      .subscribe({
        complete: () => this.toastService.dismiss(),
        error: () => {
          this.toastService.open({
            type: 'danger',
            message: translate('shared.downloadFailed'),
          });
        },
      });
  }
}
