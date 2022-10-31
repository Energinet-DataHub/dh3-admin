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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NgModule } from '@angular/core';

import { WattIconModule } from '../../../foundations/icon';
import { StorybookTableOverviewComponent } from './storybook-table-overview.component';
import { StorybookTableExpandableModule } from './expandable/storybook-table-expandable.module';

@NgModule({
  imports: [
    MatTableModule,
    WattIconModule,
    MatSortModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    StorybookTableExpandableModule
  ],
  declarations: [StorybookTableOverviewComponent],
  exports: [StorybookTableOverviewComponent],
})
export class StorybookTableOverviewModule {}
