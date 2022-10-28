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
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { render, screen } from '@testing-library/angular';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { WattTabsModule } from '@energinet-datahub/watt/tabs';
import { WattDrawerModule } from '@energinet-datahub/watt/drawer';
import {
  DhChargesPricesDrawerComponent,
  DhChargesPricesDrawerScam,
} from './dh-charges-prices-drawer.component';
import {
  ChargeType,
  Resolution,
  VatClassification,
} from '@energinet-datahub/dh/shared/domain';
import { DhChargesChargePricesTabScam } from './price-tab/dh-charges-charge-prices-tab.component';
import { DhChargesChargeHistoryTabScam } from './history-tab/dh-charges-charge-history-tab.component';
import { DhChargesChargeMessagesTabScam } from './message-tab/dh-charges-charge-messages-tab.component';
import userEvent from '@testing-library/user-event';
import { start } from 'repl';

const charge = {
  id: '6AA831CF-14F8-41D5-8E08-26939172DFAA',
  chargeType: ChargeType.D02,
  resolution: Resolution.P1D,
  taxIndicator: false,
  transparentInvoicing: true,
  vatClassification: VatClassification.NoVat,
  validFromDateTime: '2021-09-29T22:00:00',
  validToDateTime: '2021-10-29T22:00:00',
  chargeId: 'chargeid01',
  chargeName: 'Net abo A høj Forbrug 3',
  chargeDescription: 'Net abo A høj Forbrug 2 beskrivelse',
  chargeOwner: '5790000681074',
  chargeOwnerName: 'Thy-Mors Energi Elnet A/S - 042',
  hasAnyPrices: true,
};

describe('DhChargesPricesDrawerComponent', () => {
  async function setup() {
    const { fixture } = await render(DhChargesPricesDrawerComponent, {
      imports: [
        getTranslocoTestingModule(),
        MatNativeDateModule,
        DhApiModule.forRoot(),
        HttpClientModule,
        DhChargesPricesDrawerScam,
        WattTabsModule,
        WattDrawerModule,
        DhChargesChargePricesTabScam,
        DhChargesChargeMessagesTabScam,
        DhChargesChargeHistoryTabScam,
      ],
    });

    fixture.componentInstance.openDrawer(charge);
    return {
      fixture,
    };
  }

  it('should create', async () => {
    const fixture = await setup();
    expect(fixture.fixture.componentInstance).toBeTruthy();
  });

  it('price tab should be active by default', async () => {
    await setup();

    const priceTab = screen.getByRole('tab', { name: /prices/i });

    expect(priceTab).toBeInTheDocument();
    expect(priceTab).toHaveClass('mat-tab-label-active');
  });

  it('date range should default to today', async () => {
    await setup();

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });

    expect(startDateInput).toBeInTheDocument();

    const expectedDate = new Date().toLocaleDateString();
    const actualDateInput = new Date(startDateInput.value).toLocaleDateString();

    expect(actualDateInput).toEqual(expectedDate);
  });

  it('when date range updated, should be same on all tabs', async () => {
    await setup();

    // const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
    //   name: /start-date-input/i,
    // });

    // expect(startDateInput).toBeInTheDocument();

    // const value = new Date(startDateInput.value);
    // const tomorrow = value.setDate(value.getDate() + 1);

    // userEvent.type(startDateInput, tomorrow);

    // const expectedDate = tomorrow.toLocaleDateString();
    // const actualDateInput = new Date(startDateInput.value).toLocaleDateString();

    // expect(actualDateInput).toEqual(expectedDate);
  });
});
