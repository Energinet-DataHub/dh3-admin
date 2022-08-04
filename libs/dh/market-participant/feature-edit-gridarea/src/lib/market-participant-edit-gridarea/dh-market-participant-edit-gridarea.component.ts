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
import { Component, NgModule } from '@angular/core';
import { DhMarketParticipantEditOrganizationDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { LetModule } from '@rx-angular/template/let';
import {
  WattButtonModule,
  WattSpinnerModule,
  WattTabsModule,
  WattValidationMessageModule,
} from '@energinet-datahub/watt';
import { TranslocoModule } from '@ngneat/transloco';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';

@Component({
  selector: 'dh-market-participant-edit-organization',
  templateUrl: './dh-market-participant-edit-gridarea.component.html',
  styleUrls: ['./dh-market-participant-edit-gridarea.component.scss'],
  providers: [DhMarketParticipantEditOrganizationDataAccessApiStore],
})
export class DhMarketParticipantEditGridAreaComponent {
  organizationId$ = this.route.params.pipe(
    map((params) => params[dhMarketParticipantOrganizationIdParam] as string)
  );

  isLoading$ = this.store.isLoading$;
  isEditing$ = this.store.isEditing$;
  changes$ = this.store.changes$;
  validation$ = this.store.validation$;

  constructor(
    private store: DhMarketParticipantEditOrganizationDataAccessApiStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.getOrganizationAndContacts(this.organizationId$);
  }

  readonly onCancelled = () => {
    this.backToOverview();
  };

  readonly onSaved = () => {
    this.store.save(this.backToOverview);
  };

  private readonly backToOverview = () => {
    this.router.navigateByUrl(dhMarketParticipantPath);
  };
}

@NgModule({
  imports: [
    LetModule,
    CommonModule,
    TranslocoModule,
    WattButtonModule,
    WattTabsModule,
    WattSpinnerModule,
    WattValidationMessageModule,
  ],
  exports: [DhMarketParticipantEditGridAreaComponent],
  declarations: [DhMarketParticipantEditGridAreaComponent],
})
export class DhMarketParticipantEditGridAreaScam {}
