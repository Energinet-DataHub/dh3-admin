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
import { Component, Input, NgModule } from '@angular/core';
import { MeteringPointCimDto } from '@energinet-datahub/dh/shared/data-access-api';
import { WattExpansionModule, WattIconModule } from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { emDash } from '../identity/em-dash';

@Component({
  selector: 'dh-ui-secondary-master-data',
  templateUrl: './ui-secondary-master-data.component.html',
  styleUrls: ['./ui-secondary-master-data.component.scss'],
})
export class UiSecondaryMasterDataComponent {
  @Input() secondaryMasterData: MeteringPointCimDto = {};
  emDash = emDash;
}

@NgModule({
  declarations: [UiSecondaryMasterDataComponent],
  imports: [WattExpansionModule, CommonModule, TranslocoModule, WattIconModule],
  exports: [UiSecondaryMasterDataComponent],
})
export class UiSecondaryMasterDataComponentScam {}
