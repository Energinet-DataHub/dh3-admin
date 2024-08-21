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
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { Subscription, takeUntil } from 'rxjs';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';

import {
  ActorStatus,
  EicFunction,
  GetActorsByOrganizationIdDocument,
  GetOrganizationByIdDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { DhActorStatusBadgeComponent } from '@energinet-datahub/dh/market-participant/actors/feature-actors';

import { WATT_TABS } from '@energinet-datahub/watt/tabs';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { DhOrganizationDetails } from '@energinet-datahub/dh/market-participant/actors/domain';
import { WATT_TABLE, WattTableColumnDef, WattTableDataSource } from '@energinet-datahub/watt/table';

import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';

import { DhOrganizationEditModalComponent } from '../edit/dh-edit-modal.component';
import { DhOrganizationHistoryComponent } from './tabs/dh-organization-history.component';

type Actor = {
  actorNumberAndName: string;
  marketRole: EicFunction | null | undefined;
  status: ActorStatus;
};

@Component({
  selector: 'dh-organization-drawer',
  standalone: true,
  templateUrl: './dh-organization-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .organization-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .organization-metadata {
        display: flex;
        gap: var(--watt-space-ml);
      }

      .organization-metadata__item {
        align-items: center;
        display: flex;
        gap: var(--watt-space-s);
      }
    `,
  ],
  imports: [
    TranslocoPipe,
    TranslocoDirective,

    WATT_TABS,
    WATT_CARD,
    WATT_TABLE,
    WATT_DRAWER,

    VaterStackComponent,

    WattDatePipe,
    WattButtonComponent,
    WattSpinnerComponent,
    WattEmptyStateComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,

    DhEmDashFallbackPipe,
    DhActorStatusBadgeComponent,
    DhPermissionRequiredDirective,

    DhOrganizationHistoryComponent,
    DhOrganizationEditModalComponent,
  ],
})
export class DhOrganizationDrawerComponent {
  private apollo = inject(Apollo);
  private organizationSubscription?: Subscription;
  private actorsSubscription?: Subscription;

  private getOrganizationByIdQuery$ = this.apollo.watchQuery({
    errorPolicy: 'all',
    returnPartialData: true,
    query: GetOrganizationByIdDocument,
  });

  private getActorsByOrganizationIdQuery$ = this.apollo.watchQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    query: GetActorsByOrganizationIdDocument,
  });

  isLoadingOrganization = false;
  organizationFailedToLoad = false;

  isLoadingActors = false;
  actorsFailedToLoad = false;

  isLoadingAuditLog = false;
  auditLogFailedToLoad = false;

  organization: DhOrganizationDetails | undefined = undefined;

  actors: WattTableDataSource<Actor> = new WattTableDataSource<Actor>([]);

  actorColumns: WattTableColumnDef<Actor> = {
    actorNumberAndName: { accessor: 'actorNumberAndName' },
    marketRole: { accessor: 'marketRole' },
    status: { accessor: 'status' },
  };

  isEditModalVisible = false;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  public open(organizationId: string): void {
    this.drawer?.open();

    this.loadOrganization(organizationId);
    this.loadActors(organizationId);
  }

  onClose(): void {
    this.closed.emit();
  }

  modalOnClose(): void {
    this.isEditModalVisible = false;
  }

  private loadOrganization(id: string): void {
    this.organizationSubscription?.unsubscribe();

    this.getOrganizationByIdQuery$.setVariables({ id });

    this.organizationSubscription = this.getOrganizationByIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.isLoadingOrganization = result.loading;
          this.organizationFailedToLoad =
            !result.loading && (!!result.error || !!result.errors?.length);

          this.organization = result.data?.organizationById
            ? { ...result.data.organizationById, organizationId: id }
            : undefined;
        },
        error: () => {
          this.organizationFailedToLoad = true;
          this.isLoadingOrganization = false;
        },
      });
  }

  private loadActors(organizationId: string): void {
    this.actorsSubscription?.unsubscribe();

    this.getActorsByOrganizationIdQuery$.setVariables({ organizationId });

    this.actorsSubscription = this.getActorsByOrganizationIdQuery$.valueChanges
      .pipe(takeUntil(this.closed))
      .subscribe({
        next: (result) => {
          this.isLoadingActors = result.loading;
          this.actorsFailedToLoad = !result.loading && (!!result.error || !!result.errors?.length);

          const data = result.data?.actorsByOrganizationId;

          this.actors.data = data
            ? [...data]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((x) => ({
                  actorNumberAndName: `${x.glnOrEicNumber} ${x.name}`,
                  marketRole: x.marketRole,
                  status: x.status,
                }))
            : [];
        },
        error: () => {
          this.actorsFailedToLoad = true;
          this.isLoadingActors = false;
        },
      });
  }
}
