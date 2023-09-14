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
import { Component, OnChanges, ViewChild, Input } from '@angular/core';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';

import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattTooltipDirective } from '@energinet-datahub/watt/tooltip';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattTableDataSource, WattTableColumnDef, WATT_TABLE } from '@energinet-datahub/watt/table';

import { ChargeV1Dto } from '@energinet-datahub/dh/shared/domain';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { DhChargesPricesDrawerComponent } from '../drawer/dh-charges-prices-drawer.component';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker';
import { formatInTimeZone } from 'date-fns-tz';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattPaginatorComponent } from '@energinet-datahub/watt/paginator';

@Component({
  standalone: true,
  imports: [
    WATT_TABLE,
    CommonModule,
    TranslocoModule,
    RxLet,
    WattIconComponent,
    WattButtonComponent,
    WattEmptyStateComponent,
    DhFeatureFlagDirective,
    WattTooltipDirective,
    WattSpinnerComponent,
    WattDatePipe,
    WattPaginatorComponent,
    DhChargesPricesDrawerComponent,
    WATT_CARD,
  ],
  selector: 'dh-charges-prices-result',
  templateUrl: './dh-charges-prices-result.component.html',
  styleUrls: ['./dh-charges-prices-result.component.scss'],
})
export class DhChargesPricesResultComponent implements OnChanges {
  @ViewChild(DhChargesPricesDrawerComponent)
  chargePriceDrawer!: DhChargesPricesDrawerComponent;

  @Input() result?: Array<ChargeV1Dto>;
  @Input() isLoading = false;
  @Input() isInit = false;
  @Input() hasLoadingError = false;

  activeCharge?: ChargeV1Dto;

  /* eslint-disable @typescript-eslint/member-ordering */
  formatHeader = (header: string) => this.translocoService.translate(`charges.prices.${header}`);

  /* eslint-disable sonarjs/no-duplicate-string */
  columns: WattTableColumnDef<ChargeV1Dto> = {
    chargeId: { accessor: 'chargeId', size: 'max-content' },
    chargeName: { accessor: 'chargeName' },
    chargeOwnerName: { accessor: 'chargeOwnerName' },
    icons: {
      accessor: null,
      header: '-',
      size: 'max-content',
      align: 'center',
    },
    chargeType: {
      accessor: 'chargeType',
      cell: (row) => this.translocoService.translate('charges.chargeType.' + row.chargeType),
      size: 'max-content',
    },
    resolution: {
      accessor: 'resolution',
      cell: (row) => this.translocoService.translate('charges.resolutionType.' + row.resolution),
      size: 'max-content',
    },
    validFromDateTime: { accessor: 'validFromDateTime', size: 'max-content' },
    validToDateTime: { accessor: 'validToDateTime', size: 'max-content' },
  };

  readonly dataSource = new WattTableDataSource<ChargeV1Dto>();

  private dateFormat = 'dd-MM-yyyy';
  private dateTimeFormat = 'dd-MM-yyyy HH:mm:ss';

  constructor(private translocoService: TranslocoService) {}

  ngOnChanges() {
    if (this.result) this.dataSource.data = this.result;
  }

  rowClicked(charge: ChargeV1Dto) {
    this.activeCharge = charge;
    this.chargePriceDrawer.openDrawer(charge);
  }

  downloadClicked() {
    if (this.result && this.result.length > 0) {
      const csvText = [this.createHeaderLabels(), ...this.createRows()]
        .map((x) => x.join(';'))
        .join('\n');

      this.saveFile(csvText);
    }
  }

  drawerClosed() {
    this.activeCharge = undefined;
  }

  private createHeaderLabels(): string[] {
    return this.translocoService.translate<string[]>([
      'charges.prices.csvHeader.id',
      'charges.prices.csvHeader.name',
      'charges.prices.csvHeader.description',
      'charges.prices.csvHeader.owner',
      'charges.prices.csvHeader.ownerName',
      'charges.prices.csvHeader.taxIndicator',
      'charges.prices.csvHeader.vat',
      'charges.prices.csvHeader.transparentInvoicing',
      'charges.prices.csvHeader.type',
      'charges.prices.csvHeader.resolution',
      'charges.prices.csvHeader.validFromDate',
      'charges.prices.csvHeader.validToDate',
    ]);
  }

  private createRows(): (string | null | undefined)[][] {
    if (!this.result || this.result.length == 0) return [];
    return this.result
      .sort((a, b) => (a.chargeId || '').localeCompare(b.chargeId || ''))
      .map((charge) => [
        charge.chargeId,
        charge.chargeName,
        charge.chargeDescription,
        charge.chargeOwner,
        charge.chargeOwnerName,
        this.translocoService.translate(`charges.taxIndicatorType.${charge.taxIndicator}`),
        this.translocoService.translate(
          `charges.vatClassificationType.${charge.vatClassification}`
        ),
        this.translocoService.translate(
          `charges.transparentInvoicingType.${charge.transparentInvoicing}`
        ),
        this.translocoService.translate(`charges.chargeType.${charge.chargeType}`),
        this.translocoService.translate(`charges.resolutionType.${charge.resolution}`),
        formatInTimeZone(charge.validFromDateTime, danishTimeZoneIdentifier, this.dateFormat),
        charge.validToDateTime == null
          ? ''
          : formatInTimeZone(charge.validToDateTime, danishTimeZoneIdentifier, this.dateFormat),
      ]);
  }

  private saveFile(content: string): void {
    // Only browsers that support HTML5 download attribute
    const bom = '\ufeff';
    const blob = new Blob([bom, content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', this.createFilename());
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  private createFilename(): string {
    const fileType = '.csv';
    const dateString = (
      formatInTimeZone(new Date().toISOString(), danishTimeZoneIdentifier, this.dateTimeFormat) ??
      ''
    ).replace(/:/g, '_');
    return this.translocoService
      .translate('charges.prices.downloadFileName')
      .concat(' ', dateString, fileType);
  }
}
