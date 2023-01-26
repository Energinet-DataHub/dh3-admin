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

import { PermissionGuard } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  dhAdminUserManagementPath,
  dhAdminUserRoleManagementCreatePath,
} from '@energinet-datahub/dh/admin/routing';
import { DhAdminCreateUserRoleComponent } from '@energinet-datahub/dh/admin/feature-user-management';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: dhAdminUserManagementPath,
  },
  {
    path: dhAdminUserManagementPath,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('@energinet-datahub/dh/admin/feature-user-management').then(
            (m) => m.DhAdminFeatureUserManagementComponent
          ),
        canActivate: [PermissionGuard(['users:manage'])],
        data: {
          titleTranslationKey: 'admin.userManagement.topBarTitle',
        },
      },
      {
        path: dhAdminUserRoleManagementCreatePath,
        canActivate: [PermissionGuard(['users:manage'])],
        loadComponent: () =>
        import('@energinet-datahub/dh/admin/feature-user-management').then(
          (m) => m.DhAdminCreateUserRoleComponent
        ),
      },
    ],
  },
];
