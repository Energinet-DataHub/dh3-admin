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
import {
  Component,
  Input,
  OnInit,
  Signal,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';

import { WATT_CARD } from '@energinet-datahub/watt/card';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet-datahub/watt/vater';
import { WattSearchComponent } from '@energinet-datahub/watt/search';

import { EoBetaMessageComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { EoInviteConnectionComponent } from '@energinet-datahub/eo/connections/feature-invite-connection';
import { EoInviteConnectionRespondComponent } from '@energinet-datahub/eo/connections/feature-invite-connection-respond';
import {
  EoConnectionWithName,
  EoConnectionsService,
} from '@energinet-datahub/eo/connections/data-access-api';

import { EoConnectionsTableComponent } from './connections-table.component';

@Component({
  standalone: true,
  imports: [
    EoBetaMessageComponent,
    EoConnectionsTableComponent,
    EoInviteConnectionComponent,
    EoInviteConnectionRespondComponent,
    VaterFlexComponent,
    VaterSpacerComponent,
    VaterStackComponent,
    WATT_CARD,
    WattButtonComponent,
    WattSearchComponent,
  ],
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      .badge {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: var(--watt-color-neutral-grey-300);
        color: var(--watt-on-light-high-emphasis);
        border-radius: 24px;
        padding: 2px 8px;

        small {
          @include watt.typography-font-weight('semi-bold');
        }
      }
    `,
  ],
  template: `
    <eo-eo-beta-message />

    <watt-card>
      <watt-card-title>
        <vater-stack direction="row" gap="s">
          <h3 class="watt-on-light--high-emphasis">Results</h3>
          <div class="badge">
            <small>{{ amountOfConnections() }}</small>
          </div>
          <vater-spacer />
          <watt-search label="Search" (search)="search = $event" />
          <watt-button
            variant="secondary"
            icon="plus"
            (click)="inviteConnection.open()"
            data-testid="new-invitation-button"
            >New invitation link</watt-button
          >
        </vater-stack>
      </watt-card-title>
      <eo-connections-table
        [connections]="connections().data"
        [loading]="connections().loading"
        [hasError]="connections().hasError"
        [filter]="search"
        (connectionRemoved)="onConnectionRemoved($event)"
      />
    </watt-card>

    <eo-invite-connection #inviteConnection />
    <eo-invite-connection-repsond
      [connectionInvitationId]="connectionInvitationId"
      (closed)="onInviteClosed($event)"
      (connectionCreated)="onConnectionCreated($event)"
      #inviteConnectionRespond
    />
  `,
})
export class EoConnectionsComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('respond-invite') connectionInvitationId!: string;
  @ViewChild('inviteConnectionRespond', { static: true })
  inviteConnectionRespond!: EoInviteConnectionRespondComponent;

  private connectionsService = inject(EoConnectionsService);

  protected search = '';
  protected connections = signal<{
    loading: boolean;
    hasError: boolean;
    data: EoConnectionWithName[] | null;
  }>({
    loading: false,
    hasError: false,
    data: null,
  });
  protected amountOfConnections: Signal<number> = computed(
    () => this.connections().data?.length || 0
  );

  ngOnInit(): void {
    this.loadConnections();

    if (this.connectionInvitationId) {
      this.inviteConnectionRespond.open();
    }
  }

  onInviteClosed(connection: EoConnectionWithName | null) {
    if (!connection) return;
    this.connections.set({
      ...this.connections(),
      loading: false,
      hasError: false,
      data: [...(this.connections().data ?? []), connection],
    });
  }

  onConnectionCreated(connection: { id: string; companyTin: string }) {
    this.connections.set({
      ...this.connections(),
      data:
        this.connections().data?.map((x) => {
          if (x.companyTin === connection.companyTin) {
            return {
              ...x,
              id: connection.id,
            };
          }
          return x;
        }) ?? null,
    });
  }

  onConnectionRemoved(connection: EoConnectionWithName) {
    this.connections.set({
      ...this.connections(),
      data: this.connections().data?.filter((c) => c.id !== connection.id) ?? null,
    });
  }

  private loadConnections() {
    this.connections.set({ loading: true, hasError: false, data: null });
    this.connectionsService.getConnections().subscribe({
      next: (data) => {
        this.connections.set({ loading: false, hasError: false, data });
      },
      error: () => {
        this.connections.set({ loading: false, hasError: true, data: null });
      },
    });
  }
}
