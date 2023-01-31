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
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { PushModule } from '@rx-angular/template/push';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { WattDropdownComponent } from './watt-dropdown.component';

@NgModule({
  declarations: [WattDropdownComponent],
  exports: [WattDropdownComponent],
  imports: [
    MatSelectModule,
    CommonModule,
    PushModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
  ],
})
export class WattDropdownModule {}
