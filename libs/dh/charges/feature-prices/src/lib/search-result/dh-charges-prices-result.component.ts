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
  NgModule,
  AfterViewInit,
  OnChanges,
  ViewChild,
  Input,
} from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { DhFeatureFlagDirectiveModule } from '@energinet-datahub/dh/shared/feature-flags';
import { WattIconModule } from '@energinet-datahub/watt';
import { WattTooltipModule } from '@energinet-datahub/watt/tooltip';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattButtonModule } from '@energinet-datahub/watt/button';

import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { DhSharedUiPaginatorComponent } from '@energinet-datahub/dh/shared/ui-paginator';
import { ToLowerSort } from '@energinet-datahub/dh/shared/util-table';
import {
  DhChargesPricesDrawerComponent,
  DhChargesPricesDrawerScam,
} from '../drawer/dh-charges-prices-drawer.component';

@Component({
  selector: 'dh-charges-prices-result',
  templateUrl: './dh-charges-prices-result.component.html',
  styleUrls: ['./dh-charges-prices-result.component.scss'],
})
export class DhChargesPricesResultComponent
  implements AfterViewInit, OnChanges
{
  @ViewChild(DhSharedUiPaginatorComponent)
  paginator!: DhSharedUiPaginatorComponent;
  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(DhChargesPricesDrawerComponent)
  chargePriceDrawer!: DhChargesPricesDrawerComponent;

  @Input() result?: Array<ChargeV1Dto>;
  @Input() isLoading = false;
  @Input() isInit = false;
  @Input() hasLoadingError = false;

  activeChargeId?: string | null;
  displayedColumns = [
    'chargeId',
    'chargeName',
    'chargeOwnerName',
    'icons',
    'chargeType',
    'resolution',
    'validFromDateTime',
    'validToDateTime',
  ];

  readonly dataSource: MatTableDataSource<ChargeV1Dto> =
    new MatTableDataSource<ChargeV1Dto>();

  ngOnChanges() {
    if (this.result) this.dataSource.data = this.result;

    this.dataSource.paginator = this.paginator?.instance;
    this.dataSource.sort = this.matSort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator.instance;
    this.dataSource.sortingDataAccessor = ToLowerSort();
  }

  rowClicked(charge: ChargeV1Dto) {
    this.activeChargeId = charge.chargeId;
    this.chargePriceDrawer.openDrawer(charge);
  }

  drawerClosed() {
    this.activeChargeId = null;
  }
}

@NgModule({
  declarations: [DhChargesPricesResultComponent],
  exports: [DhChargesPricesResultComponent],
  imports: [
    CommonModule,
    MatTableModule,
    TranslocoModule,
    LetModule,
    WattIconModule,
    WattButtonModule,
    WattEmptyStateModule,
    DhFeatureFlagDirectiveModule,
    WattTooltipModule,
    WattSpinnerModule,
    DhSharedUiDateTimeModule,
    MatSortModule,
    DhChargesPricesDrawerScam,
    DhSharedUiPaginatorComponent,
  ],
})
export class DhChargesPricesResultScam {}
