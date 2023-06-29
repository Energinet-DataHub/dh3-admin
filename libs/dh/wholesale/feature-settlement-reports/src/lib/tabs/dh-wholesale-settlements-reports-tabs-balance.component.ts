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
  LOCALE_ID,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ApolloError } from '@apollo/client/errors';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { WATT_FORM_FIELD, WattFormChipDirective } from '@energinet-datahub/watt/form-field';
import { WholesaleProcessType, graphql } from '@energinet-datahub/dh/shared/domain';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';
import { Actor, ActorFilter, GridArea } from '@energinet-datahub/dh/wholesale/domain';
import { DhWholesaleSettlementReportsDataAccessApiStore } from '@energinet-datahub/dh/wholesale/data-access-api';
import { WattRangeValidators } from '@energinet-datahub/watt/validators';
import { WattToastService } from '@energinet-datahub/watt/toast';
import {
  WATT_TABLE,
  WattTableColumnDef,
  WattTableComponent,
  WattTableDataSource,
} from '@energinet-datahub/watt/table';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';

export type settlementReportsTableColumns = graphql.GridArea & { download: boolean };

@Component({
  standalone: true,
  selector: 'dh-wholesale-settlements-reports-tabs-balance',
  templateUrl: './dh-wholesale-settlements-reports-tabs-balance.component.html',
  styleUrls: ['./dh-wholesale-settlements-reports-tabs-balance.component.scss'],
  imports: [
    WATT_TABS,
    WATT_CARD,
    WATT_TABLE,
    TranslocoModule,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
    ReactiveFormsModule,
    WATT_FORM_FIELD,
    WattDropdownComponent,
    WattEmptyStateComponent,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhWholesaleSettlementsReportsTabsBalanceComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private fb: FormBuilder = inject(FormBuilder);
  private apollo = inject(Apollo);
  private transloco = inject(TranslocoService);
  private toastService = inject(WattToastService);
  private settlementReportStore = inject(DhWholesaleSettlementReportsDataAccessApiStore);
  private localeId = inject(LOCALE_ID);

  private subscriptionGridAreas?: Subscription;
  private subscriptionGridAreasForFilter?: Subscription;
  private subscriptionActors?: Subscription;
  private subscriptionGridAreaSelected?: Subscription;

  @ViewChild(WattTableComponent)
  resultTable!: WattTableComponent<settlementReportsTableColumns>;

  searchForm = this.fb.group({
    period: [{ start: '', end: '' }, WattRangeValidators.required()],
    actor: [''],
    gridAreas: [[] as string[]],
  });

  columns: WattTableColumnDef<settlementReportsTableColumns> = {
    gridAreaName: { accessor: 'name' },
    gridAreaCode: { accessor: 'code' },
    download: { accessor: null },
  };

  actorsQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetActorsForSettlementReportDocument,
    variables: {
      eicFunctions: [graphql.EicFunction.GridAccessProvider, graphql.EicFunction.EnergySupplier],
    },
  });

  gridAreasQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetGridAreasDocument,
  });

  gridAreasForFilterQuery = this.apollo.watchQuery({
    useInitialLoading: true,
    notifyOnNetworkStatusChange: true,
    query: graphql.GetGridAreasDocument,
  });

  actors!: ActorFilter;
  gridAreas: WattDropdownOption[] = [];
  selectedGridAreas?: string[];
  error?: ApolloError;
  dataSource = new WattTableDataSource<settlementReportsTableColumns>();

  ngOnInit(): void {
    this.subscriptionActors = this.actorsQuery.valueChanges.subscribe({
      next: (result) => {
        const actorsClone = structuredClone(result.data?.actors ?? []);
        this.actors = actorsClone.sort((a: Actor, b: Actor) =>
          a.displayValue.localeCompare(b.displayValue, this.localeId)
        );

        if (!result.loading) this.searchForm.controls.actor.enable();
      },
      error: (error) => {
        this.error = error;
      },
    });

    this.subscriptionGridAreas = this.gridAreasQuery.valueChanges.subscribe({
      next: (result) => {
        this.error = result.error;
        this.dataSource.data =
          result.data?.gridAreas
            ?.filter((x) => {
              if (!this.selectedGridAreas || this.selectedGridAreas?.length === 0) return true;
              return this.selectedGridAreas?.includes(x.code);
            })
            .map((g) => ({
              code: g.code,
              id: g.code,
              name: g.name,
              priceAreaCode: graphql.PriceAreaCode.Dk_1,
              validFrom: g.validFrom,
              validtTo: g.validTo,
              download: true,
            })) ?? [];
      },
      error: (error) => {
        this.error = error;
      },
    });

    this.subscriptionGridAreasForFilter = this.gridAreasForFilterQuery.valueChanges.subscribe({
      next: (result) => {
        const gridAreasClone = structuredClone(result.data?.gridAreas ?? []);
        gridAreasClone.sort((a: GridArea, b: GridArea) => Number(a.code) - Number(b.code));

        this.gridAreas = gridAreasClone.map((g: GridArea) => ({
          displayValue: `${g.name} (${g.code})`,
          value: g.code,
        }));

        if (!result.loading) this.searchForm.controls.gridAreas.enable();
      },
      error: () => {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate('wholesale.settlementReports.gridAreasLoadFailed'),
        });
      },
    });
  }

  ngAfterViewInit(): void {
    this.subscriptionGridAreaSelected = this.searchForm.controls.gridAreas.valueChanges.subscribe(
      (value) => {
        this.selectedGridAreas = value ?? [];
        this.resultTable.clearSelection();
        this.gridAreasQuery.refetch();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptionGridAreas?.unsubscribe();
    this.subscriptionActors?.unsubscribe();
    this.subscriptionGridAreaSelected?.unsubscribe();
    this.subscriptionGridAreasForFilter?.unsubscribe();
  }

  downloadClicked(gridAreas: settlementReportsTableColumns[]) {
    this.toastService.open({
      type: 'loading',
      message: this.transloco.translate('wholesale.settlementReports.downloadStart'),
    });
    this.settlementReportStore.download(
      {
        gridAreas: gridAreas.map((g) => g.id),
        processType: WholesaleProcessType.BalanceFixing,
        periodStart: this.searchForm.controls.period.value?.start ?? '',
        periodEnd: this.searchForm.controls.period.value?.end ?? '',
        energySupplier: this.searchForm.controls.actor.value ?? undefined,
        locale: this.transloco.translate('selectedLanguageIso'),
      },
      () => {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate('wholesale.settlementReports.downloadFailed'),
        });
      },
      () => {
        this.toastService.dismiss();
      }
    );
  }
}
