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
import { DhApiModule } from '@energinet-datahub/dh/shared/data-access-api';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { HttpClientModule } from '@angular/common/http';
import { formatInTimeZone } from 'date-fns-tz';
import { fireEvent, render, screen, waitFor } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { DhChargesPricesComponent } from './dh-charges-prices.component';
import { en as enTranslations } from '@energinet-datahub/dh/globalization/assets-localization';
import { WattDanishDatetimeModule } from '@energinet-datahub/watt/danish-date-time';
import { DanishLocaleModule } from '@energinet-datahub/gf/configuration-danish-locale';
import { DrawerDatepickerService } from './drawer/charge-content/drawer-datepicker/drawer-datepicker.service';
import { WattTopBarOutletComponent } from '@energinet-datahub/watt/shell';

const wattDrawerName = 'watt-drawer';
const dateTimeFormat = 'dd-MM-yyyy';
import { danishTimeZoneIdentifier } from '@energinet-datahub/watt/datepicker';

describe(DhChargesPricesComponent.name, () => {
  async function setup() {
    const { fixture } = await render(
      `<watt-top-bar-outlet></watt-top-bar-outlet><dh-charges-prices></dh-charges-prices>`,
      {
        componentProviders: [
          {
            provide: DrawerDatepickerService,
            useValue: new DrawerDatepickerService(),
          },
        ],
        imports: [
          getTranslocoTestingModule(),
          DhApiModule.forRoot(),
          HttpClientModule,
          DhChargesPricesComponent,
          WattDanishDatetimeModule.forRoot(),
          DanishLocaleModule,
          WattTopBarOutletComponent,
        ],
      }
    );

    return {
      fixture,
    };
  }

  it('should fetch and render data on submit', async () => {
    await setup();

    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.click(searchButton);

    const id = await waitFor(() => screen.getByRole('gridcell', { name: /0AA1F/i }));

    expect(id).toBeInTheDocument();
  });

  it('should empty all input fields and result on reset', async () => {
    await setup();

    const idInputField = screen.getByLabelText(/price id\/name/i, {
      suggest: false,
    });

    await userEvent.type(idInputField, 'test 123');

    expect(idInputField).toHaveValue('test 123');

    const resetButton = screen.getByRole('button', { name: /clear/i });
    await userEvent.click(resetButton);

    expect(idInputField).toHaveValue('');

    const searchTextLabel = screen.getByText(enTranslations.charges.prices.startSearchText);
    expect(searchTextLabel).toBeInTheDocument();
  });

  it('should open a drawer when clicking on row', async () => {
    await setup();

    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.click(searchButton);

    const id = await waitFor(() => screen.getByRole('gridcell', { name: /0AA1F/i }));

    expect(id).toBeInTheDocument();
    await userEvent.click(id);

    const drawer = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === wattDrawerName
    );

    expect(drawer).toBeInTheDocument();
  });

  it.skip('when drawer is open, date range should be set', async () => {
    await setup();

    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.click(searchButton);

    const id = await waitFor(() => screen.getByRole('gridcell', { name: /0AA1F/i }));

    expect(id).toBeInTheDocument();
    await userEvent.click(id);

    const drawer = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === wattDrawerName
    );

    expect(drawer).toBeInTheDocument();

    const startDateInput: HTMLInputElement = await waitFor(() =>
      screen.getByRole('textbox', {
        name: /start-date-input/i,
      })
    );

    expect(startDateInput).toBeInTheDocument();

    const now = new Date();
    const expectedDate = formatInTimeZone(now, danishTimeZoneIdentifier, dateTimeFormat);

    expect(startDateInput.value).toEqual(expectedDate);
  });

  it.skip('when date range in drawer is changed, it should be reset to today on close.', async () => {
    await setup();

    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.click(searchButton);

    const tableCell = await waitFor(() => screen.getByRole('gridcell', { name: /0AA1F/i }));

    expect(tableCell).toBeInTheDocument();
    await userEvent.click(tableCell);
    await new Promise((res) => setTimeout(res, 0));

    const drawer = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === wattDrawerName
    );

    expect(drawer).toBeInTheDocument();

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });

    expect(startDateInput).toBeInTheDocument();

    const expectedDateUTC = new Date(new Date().setHours(0, 0, 0, 0));
    const expectedDate = formatInTimeZone(
      expectedDateUTC,
      danishTimeZoneIdentifier,
      dateTimeFormat
    );
    const actualDateInput = new Date(startDateInput.value).toLocaleDateString();
    const expectedDateInput = new Date(expectedDate).toLocaleDateString();

    expect(actualDateInput).toEqual(expectedDateInput);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    fireEvent.change(startDateInput, {
      target: { value: tomorrow.toISOString() },
    });

    expect(startDateInput.value).toBe(tomorrow.toISOString());

    // Close Drawer
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    await userEvent.click(closeButton);
    await new Promise((res) => setTimeout(res, 0));

    await waitFor(() => {
      expect(startDateInput).not.toBeVisible();
    });

    // Open drawer again
    expect(tableCell).toBeInTheDocument();
    await userEvent.click(tableCell);
    await new Promise((res) => setTimeout(res, 0));

    const drawer2 = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === wattDrawerName
    );

    expect(drawer2).toBeInTheDocument();

    const startDateInput2: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });

    expect(startDateInput2).toBeInTheDocument();
    const actualDateInput2 = new Date(startDateInput2.value).toLocaleDateString();

    expect(actualDateInput2).toEqual(expectedDate);
  });

  it.todo('should clear valid from and valid to when selecting validity');
  it.todo('should clear "user defined" in validity when entering valid dates');
});
