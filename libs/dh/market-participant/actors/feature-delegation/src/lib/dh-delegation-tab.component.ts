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
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { TranslocoDirective } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattModalService } from '@energinet-datahub/watt/modal';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';
import {
  VaterFlexComponent,
  VaterSpacerComponent,
  VaterStackComponent,
} from '@energinet-datahub/watt/vater';
import { DhActorExtended } from '@energinet-datahub/dh/market-participant/actors/domain';
import {
  ActorDelegationStatus,
  GetDelegationsForActorDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';

import { DhDelegations } from './dh-delegations';
import { DhDelegationsOverviewComponent } from './overview/dh-delegations-overview.component';
import { DhDelegationCreateModalComponent } from './create/dh-delegation-create-modal.component';

@Component({
  selector: 'dh-delegation-tab',
  standalone: true,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  templateUrl: './dh-delegation-tab.component.html',
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    VaterFlexComponent,
    VaterStackComponent,
    VaterSpacerComponent,
    WattEmptyStateComponent,
    WattButtonComponent,
    WattSpinnerComponent,
    WattDropdownComponent,

    DhPermissionRequiredDirective,
    DhDropdownTranslatorDirective,
    DhDelegationsOverviewComponent,
  ],
})
export class DhDelegationTabComponent {
  private readonly _modalService = inject(WattModalService);
  private readonly _apollo = inject(Apollo);
  private readonly _destroyRef = inject(DestroyRef);

  actor = input.required<DhActorExtended>();
  isLoading = signal(false);
  isError = signal(false);

  delegationsRaw = signal<DhDelegations>([]);
  delegations = signal<DhDelegations>([]);

  isEmpty = computed(() => this.delegationsRaw().length === 0);

  statusControl = new FormControl<ActorDelegationStatus[] | null>(null);
  statusOptions = dhEnumToWattDropdownOptions(ActorDelegationStatus);

  constructor() {
    effect(() => this.fetchData(this.actor().id), { allowSignalWrites: true });

    this.statusControl.valueChanges.subscribe((value) => {
      this.filterDelegations(value);
    });
  }

  onSetUpDelegation() {
    this._modalService.open({ component: DhDelegationCreateModalComponent, data: this.actor() });
  }

  private filterDelegations(filter: ActorDelegationStatus[] | null) {
    const delegations = untracked(this.delegationsRaw);

    if (filter === null) {
      return this.delegations.set(delegations);
    }

    const delegationsFiltered = delegations.filter((delegation) => {
      return filter.includes(delegation.status);
    });

    this.delegations.set(delegationsFiltered);
  }

  private fetchData(actorId: string) {
    this.isLoading.set(true);
    this.isError.set(false);
    this.delegationsRaw.set([]);
    this.statusControl.reset();

    this._apollo
      .watchQuery({
        query: GetDelegationsForActorDocument,
        variables: { actorId },
      })
      .valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (result) => {
          this.isLoading.set(result.loading);

          this.delegationsRaw.set(result.data.delegationsForActor);

          this.delegations.set(this.delegationsRaw());
        },
        error: () => {
          this.isLoading.set(false);
          this.isError.set(true);
        },
      });
  }
}
