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
import userEvent from '@testing-library/user-event';
import { HttpClientModule } from '@angular/common/http';
import { render, screen, waitFor } from '@testing-library/angular';
import { graphQLProviders } from '@energinet-datahub/dh/shared/data-access-graphql';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { danishDatetimeProviders } from '@energinet-datahub/watt/danish-date-time';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';
import { importProvidersFrom } from '@angular/core';
import { ApolloModule } from 'apollo-angular';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { DhWholesaleSearchComponent } from './dh-wholesale-search.component';

async function setup() {
  await render(`<dh-wholesale-search></dh-wholesale-search>`, {
    providers: [
      importProvidersFrom(MatLegacySnackBarModule, MatDateFnsModule),
      graphQLProviders,
      danishDatetimeProviders,
    ],
    imports: [
      ApolloModule,
      DhWholesaleSearchComponent,
      getTranslocoTestingModule(),
      HttpClientModule,
    ],
  });
}

describe(DhWholesaleSearchComponent, () => {
  it('should show period with initial value', async () => {
    await setup();
    expect(screen.getAllByText('Execution time')[0]).toBeInTheDocument();
  });

  it('should set initial value of period', async () => {
    await setup();

    const startDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /start-date-input/i,
    });
    const endDateInput: HTMLInputElement = screen.getByRole('textbox', {
      name: /end-date-input/i,
    });

    expect(startDateInput.value).not.toBe('');
    expect(endDateInput.value).not.toBe('');
  });

  it('should show search button', async () => {
    await setup();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('should search batches on init', async () => {
    await setup();
    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
  });

  it('should show loading indicator when starting a new search of batches', async () => {
    await setup();

    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    userEvent.click(screen.getByText('Search'));
    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  });
});
