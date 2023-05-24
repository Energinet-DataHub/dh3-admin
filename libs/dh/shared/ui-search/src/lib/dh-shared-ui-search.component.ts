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
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFormFieldComponent } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';

export const searchDebounceTimeMs = 250;

@Component({
  selector: 'dh-shared-ui-search',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'shared'">
      <watt-form-field class="search-field">
        <input wattInput [formControl]="searchControl" [placeholder]="placeholder ?? t('search')" />
        <watt-button wattSuffix variant="icon" icon="search"></watt-button>
      </watt-form-field>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .search-field {
        width: 20rem;
      }
    `,
  ],
  imports: [
    TranslocoModule,
    ReactiveFormsModule,
    WattFormFieldComponent,
    WattInputModule,
    WattButtonComponent,
  ],
})
export class DhSharedUiSearchComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('', { nonNullable: true });
  @Input() placeholder?: string;

  @Output() search = new EventEmitter<string>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(searchDebounceTimeMs), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => this.search.emit(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
