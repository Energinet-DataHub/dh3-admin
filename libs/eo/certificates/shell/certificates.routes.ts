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

import { Routes } from '@angular/router';
import { EoCertificateDetailsComponent } from '@energinet-datahub/eo/certificates/feature-details';
import { EoCertificatesOverviewComponent } from '@energinet-datahub/eo/certificates/feature-overview';

export const eoCertificatesRoutes: Routes = [
  {
    path: '',
    title: 'Certificates',
    component: EoCertificatesOverviewComponent,
  },
  {
    path: ':id',
    title: 'Certificate details',
    component: EoCertificateDetailsComponent,
  },
];
