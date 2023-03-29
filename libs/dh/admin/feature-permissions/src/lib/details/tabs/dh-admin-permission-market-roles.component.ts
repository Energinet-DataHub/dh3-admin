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
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattCardModule } from '@energinet-datahub/watt/card';
import { WattTableColumnDef, WattTableDataSource, WATT_TABLE } from '@energinet-datahub/watt/table';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PermissionDto, graphql } from '@energinet-datahub/dh/shared/domain';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { ApolloError } from '@apollo/client';
import { LetModule } from '@rx-angular/template/let';
import type { ResultOf } from '@graphql-typed-document-node/core';

type UserRole = ResultOf<
  typeof graphql.GetPermissionDetailsDocument
>['permission']['userRoles'][number];

@Component({
  selector: 'dh-admin-permission-market-roles',
  templateUrl: './dh-admin-permission-market-roles.component.html',
  styles: [``],
  standalone: true,
  imports: [
    CommonModule,
    WattCardModule,
    WattSpinnerModule,
    WATT_TABLE,
    WattEmptyStateModule,
    TranslocoModule,
    LetModule,
  ],
})
export class DhAdminPermissionMarketRolesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() selectedPermission: PermissionDto | null = null;
  private apollo = inject(Apollo);
  private trans: TranslocoService = inject(TranslocoService);

  subscription!: Subscription;
  marketRoles?: UserRole[];
  loading = false;
  error?: ApolloError;

  dataSource = new WattTableDataSource<UserRole>();

  columns: WattTableColumnDef<UserRole> = {
    name: { accessor: 'name' },
  };

  private getPermissionQuery?: QueryRef<
    graphql.GetPermissionDetailsQuery,
    {
      id: string;
    }
  >;

  ngOnInit(): void {
    this.getPermissionQuery = this.apollo.watchQuery({
      useInitialLoading: true,
      notifyOnNetworkStatusChange: true,
      query: graphql.GetPermissionDetailsDocument,
      variables: { id: this.selectedPermission?.id.toString() ?? '' },
    });

    this.subscription = this.getPermissionQuery.valueChanges.subscribe({
      next: (result) => {
        this.marketRoles = result.data?.permission?.marketRoles ?? [];
        this.loading = result.loading;
        this.error = result.error;
        this.dataSource.data = this.marketRoles;
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.selectedPermission.firstChange === false &&
      changes.selectedPermission.currentValue
    ) {
      const id = changes.selectedPermission.currentValue.id.toString();

      this.getPermissionQuery?.refetch({ id });
    }
  }

  translateHeader = (columnId: string): string => {
    const baseKey = 'admin.userManagement.permissionDetail.tabs.marketRoles.columns';
    return this.trans.translate(`${baseKey}.${columnId}`);
  };
}
