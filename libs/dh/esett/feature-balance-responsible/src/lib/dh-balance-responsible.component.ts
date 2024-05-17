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
import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, translate } from '@ngneat/transloco';
import { switchMap, catchError, of, take } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { RxPush } from '@rx-angular/template/push';
import { PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Sort } from '@angular/material/sort';
import { RxLet } from '@rx-angular/template/let';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattTableDataSource, WattPaginatorComponent } from '@energinet-datahub/watt/table';
import {
  DownloadBalanceResponsiblesDocument,
  GetBalanceResponsibleMessagesDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
  VaterUtilityDirective,
} from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { exportToCSVRaw } from '@energinet-datahub/dh/shared/ui-util';
import { WattToastService } from '@energinet-datahub/watt/toast';

import { DhBalanceResponsibleTableComponent } from './table/dh-table.component';
import { DhBalanceResponsibleMessage } from './dh-balance-responsible-message';
import { DhBalanceResponsibleStore } from './dh-balance-respoinsible.store';

@Component({
  standalone: true,
  selector: 'dh-balance-responsible',
  templateUrl: './dh-balance-responsible.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      h3 {
        margin: 0;
      }

      watt-paginator {
        --watt-space-ml--negative: calc(var(--watt-space-ml) * -1);

        display: block;
        margin: 0 var(--watt-space-ml--negative) var(--watt-space-ml--negative)
          var(--watt-space-ml--negative);
      }
    `,
  ],
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    RxPush,
    RxLet,

    WATT_CARD,
    WattPaginatorComponent,
    VaterFlexComponent,
    VaterStackComponent,
    VaterUtilityDirective,
    VaterSpacerComponent,
    WattButtonComponent,

    DhBalanceResponsibleTableComponent,
  ],
  providers: [DhBalanceResponsibleStore],
})
export class DhBalanceResponsibleComponent implements OnInit {
  private apollo = inject(Apollo);
  private destroyRef = inject(DestroyRef);
  private store = inject(DhBalanceResponsibleStore);
  private toastService = inject(WattToastService);

  pageMetaData$ = this.store.pageMetaData$;
  sortMetaData$ = this.store.sortMetaData$;

  tableDataSource = new WattTableDataSource<DhBalanceResponsibleMessage>([], {
    disableClientSideSort: true,
  });
  totalCount = 0;

  isLoading = false;
  isDownloading = false;
  hasError = false;

  outgoingMessages$ = this.store.queryVariables$.pipe(
    switchMap(({ pageMetaData, sortMetaData }) =>
      this.apollo
        .watchQuery({
          fetchPolicy: 'cache-and-network',
          query: GetBalanceResponsibleMessagesDocument,
          variables: {
            // 1 needs to be added here because the paginator's `pageIndex` property starts at `0`
            // whereas our endpoint's `pageNumber` param starts at `1`
            pageNumber: pageMetaData.pageIndex + 1,
            pageSize: pageMetaData.pageSize,
            sortProperty: sortMetaData.sortProperty,
            sortDirection: sortMetaData.sortDirection,
          },
        })
        .valueChanges.pipe(catchError(() => of({ loading: false, data: null, errors: [] })))
    )
  );

  ngOnInit() {
    this.outgoingMessages$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.isLoading = result.loading;

        this.tableDataSource.data = result.data?.balanceResponsible.page ?? [];
        this.totalCount = result.data?.balanceResponsible.totalCount ?? 0;

        this.hasError = !!result.errors;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  onSortEvent(sortMetaData: Sort): void {
    this.store.patchState((state) => ({
      ...state,
      sortMetaData,
      pageMetaData: { ...state.pageMetaData, pageIndex: 0 },
    }));
  }

  onPageEvent({ pageIndex, pageSize }: PageEvent): void {
    this.store.patchState((state) => ({ ...state, pageMetaData: { pageIndex, pageSize } }));
  }

  download() {
    this.isDownloading = true;

    this.store.queryVariables$
      .pipe(
        take(1),
        switchMap(({ sortMetaData }) =>
          this.apollo.query({
            returnPartialData: false,
            fetchPolicy: 'no-cache',
            query: DownloadBalanceResponsiblesDocument,
            variables: {
              locale: translate('selectedLanguageIso'),
              sortProperty: sortMetaData.sortProperty,
              sortDirection: sortMetaData.sortDirection,
            },
          })
        )
      )
      .subscribe({
        next: (result) => {
          this.isDownloading = result.loading;

          exportToCSVRaw({
            content: result?.data?.downloadBalanceResponsibles ?? '',
            fileName: 'eSett-balance-responsible-messages',
          });
        },
        error: () => {
          this.isDownloading = false;
          this.toastService.open({
            message: translate('shared.error.message'),
            type: 'danger',
          });
        },
      });
  }
}
