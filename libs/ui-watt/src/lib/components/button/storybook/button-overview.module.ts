/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { WattButtonModule } from '../watt-button.module';
import { ButtonOverviewComponent } from './button-overview.component';

@NgModule({
  declarations: [ButtonOverviewComponent],
  exports: [ButtonOverviewComponent],
  imports: [
    CommonModule,
    WattButtonModule,
    MatCardModule,
    RouterModule,
    RouterTestingModule.withRoutes([]),
  ],
})
export class ButtonOverviewModule {}
