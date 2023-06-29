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
import DhCalculationsPageComponent from './page';

async function setup() {
  await render(`<dh-calculations-page></dh-calculations-page>`, {
    providers: [
      importProvidersFrom(MatLegacySnackBarModule),
      graphQLProviders,
      danishDatetimeProviders,
    ],
    imports: [
      ApolloModule,
      DhCalculationsPageComponent,
      getTranslocoTestingModule(),
      HttpClientModule,
    ],
  });
}

describe(DhCalculationsPageComponent, () => {
  it('should show filter chips with initial values', async () => {
    await setup();
    ['Period', 'Calculation type', 'Grid areas', 'Execution time', 'Status']
      .map((filter) =>
        screen.getByRole('button', {
          name: new RegExp(filter),
          pressed: filter === 'Execution time',
        })
      )
      .forEach((element) => expect(element).toBeInTheDocument());
  });

  it('should show clear button', async () => {
    await setup();
    expect(screen.getByRole('button', { name: /Reset/ })).toBeInTheDocument();
  });

  it('should show search button', async () => {
    await setup();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('should search batches on init', async () => {
    await setup();
    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
  });

  it('should show loading indicator when changing filters', async () => {
    await setup();

    expect(screen.queryByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const button = screen.getByRole('button', { name: /Calculation type/, pressed: false });
    userEvent.click(button);

    const checkbox = screen.getByRole('option', { name: /Aggregation/i });
    userEvent.click(checkbox);

    await waitFor(() => expect(screen.queryByRole('progressbar')).toBeInTheDocument());
  }, 10000);
});
