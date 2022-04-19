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
import { Component, NgModule, OnInit } from '@angular/core';
import { DhMarketParticipantEditOrganizationDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { WattButtonModule, WattTabsModule } from '@energinet-datahub/watt';

@Component({
  selector: 'dh-market-participant-edit-organization',
  templateUrl: './dh-market-participant-edit-organization.component.html',
  styleUrls: ['./dh-market-participant-edit-organization.component.scss'],
})
export class DhMarketParticipantEditOrganizationComponent implements OnInit {
  constructor(
    public store: DhMarketParticipantEditOrganizationDataAccessApiStore
  ) {}

  ngOnInit(): void {}
}

@NgModule({
  imports: [WattButtonModule, WattTabsModule],
  exports: [DhMarketParticipantEditOrganizationComponent],
  declarations: [DhMarketParticipantEditOrganizationComponent],
})
export class DhMarketParticipantEditOrganizationScam {}
