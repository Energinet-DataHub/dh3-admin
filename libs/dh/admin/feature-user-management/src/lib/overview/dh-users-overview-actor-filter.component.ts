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
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';

@Component({
  selector: 'dh-users-overview-actor-filter',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users.filter'">
      <watt-dropdown
        [placeholder]="t('marketPartyPlaceholder')"
        [formControl]="actorControl"
        [options]="actorOptions"
        [multiple]="false"
        [chipMode]="true"
      />
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  imports: [TranslocoDirective, ReactiveFormsModule, WattDropdownComponent],
})
export class DhUsersOverviewActorFilterComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  actorControl = new FormControl<string | undefined>(undefined, {
    nonNullable: true,
  });

  @Input() actorOptions: WattDropdownOptions = [];
  @Output() changed = new EventEmitter<string | undefined>();

  ngOnInit(): void {
    this.actorControl.valueChanges
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value) => this.changed.emit(value));
  }
}
