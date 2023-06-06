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
import { Component, NgModule, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template/push';
import { LetModule } from '@rx-angular/template/let';
import { map } from 'rxjs';

import {
  ActorChanges,
  ActorContactChanges,
  DhMarketParticipantEditActorDataAccessApiStore,
  MarketRoleChanges,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  dhMarketParticipantActorIdParam,
  dhMarketParticipantOrganizationIdParam,
  dhMarketParticipantOrganizationsPath,
  dhMarketParticipantPath,
} from '@energinet-datahub/dh/market-participant/routing';
import {
  MarketParticipantActorContactDto,
  MarketParticipantActorStatus,
} from '@energinet-datahub/dh/shared/domain';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

import { DhMarketParticipantActorContactDataComponent } from './contact-data/dh-market-participant-actor-contact-data.component';
import { DhMarketParticipantActorMasterDataComponent } from './master-data/dh-market-participant-actor-master-data.component';
import { DhMarketParticipantActorMarketRolesComponent } from './market-roles/dh-market-participant-actor-market-roles.component';

@Component({
  selector: 'dh-market-participant-edit-actor',
  templateUrl: './dh-market-participant-edit-actor.component.html',
  styleUrls: ['./dh-market-participant-edit-actor.component.scss'],
  providers: [DhMarketParticipantEditActorDataAccessApiStore],
  standalone: true,
  imports: [
    LetModule,
    PushModule,
    CommonModule,
    TranslocoModule,
    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattSpinnerComponent,
    WATT_MODAL,
    PushModule,
    DhMarketParticipantActorMasterDataComponent,
    DhMarketParticipantActorContactDataComponent,
    DhMarketParticipantActorMarketRolesComponent,
    WattValidationMessageComponent,
  ],
})
export class DhMarketParticipantEditActorComponent {
  routeParams$ = this.route.params.pipe(
    map((params) => ({
      organizationId: params[dhMarketParticipantOrganizationIdParam] as string,
      actorId: params[dhMarketParticipantActorIdParam] as string,
    }))
  );
  isLoading$ = this.store.isLoading$;
  isEditing$ = this.store.isEditing$;
  changes$ = this.store.changes$;
  status$ = this.store.status$;
  validation$ = this.store.validation$;
  gridAreas$ = this.store.gridAreas$;
  marketRoles$ = this.store.marketRoles$;
  contacts$ = this.store.contacts$;

  @ViewChild('confirmationModal') confirmationModal!: WattModalComponent;

  constructor(
    private store: DhMarketParticipantEditActorDataAccessApiStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.store.loadInitialData(this.routeParams$);
  }

  readonly onMasterDataChanged = (changes: ActorChanges) => {
    this.store.setMasterDataChanges(changes);
  };

  readonly onMarketRolesChange = (marketRoleChanges: MarketRoleChanges) => {
    this.store.setMarketRoleChanges(marketRoleChanges);
  };

  readonly onContactsChanged = (
    isValid: boolean,
    added: ActorContactChanges[],
    removed: MarketParticipantActorContactDto[]
  ) => {
    this.store.setContactChanges(isValid, added, removed);
  };

  readonly onCancelled = () => {
    this.backToOverview();
  };

  readonly onSaved = (initialStatus: MarketParticipantActorStatus, changes: ActorChanges) => {
    if (
      (changes.status === MarketParticipantActorStatus.Inactive &&
        initialStatus !== MarketParticipantActorStatus.Inactive) ||
      (changes.status == MarketParticipantActorStatus.Passive &&
        initialStatus != MarketParticipantActorStatus.Passive)
    ) {
      this.confirmationModal.open();
    } else {
      this.store.save(this.backToOverview);
    }
  };

  readonly modalClosed = (accepted: boolean) => {
    if (accepted) this.store.save(this.backToOverview);
  };

  private readonly backToOverview = () => {
    this.router.navigateByUrl(`${dhMarketParticipantPath}/${dhMarketParticipantOrganizationsPath}`);
  };
}
