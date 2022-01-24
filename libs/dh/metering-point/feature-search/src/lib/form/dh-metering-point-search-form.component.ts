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
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
} from '@energinet-datahub/watt';

import { meteringPointIdValidator } from './dh-metering-point.validator';
import { Subscription } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-search-form',
  styleUrls: ['./dh-metering-point-search-form.component.scss'],
  templateUrl: './dh-metering-point-search-form.component.html',
})
export class DhMeteringPointSearchFormComponent
  implements AfterViewInit, OnDestroy
{
  @Input() loading = false;
  @Output() search = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput?: ElementRef;

  queryParamsSubscription?: Subscription;

  searchControl = new FormControl('', [meteringPointIdValidator()]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.setInitialValue(params.q);
        this.focusSearchInput();
      }
    );
    this.focusSearchInput();
  }

  ngOnDestroy() {
    this.queryParamsSubscription?.unsubscribe();
  }

  onSearchInputClear(): void {
    this.searchControl.setValue('');
    this.updateQueryParam(null);
  }

  onSubmit() {
    this.updateQueryParam(this.searchControl.value);

    if (!this.searchControl.valid) {
      this.focusSearchInput();
      return;
    } else if (this.loading) return;

    this.search.emit(this.searchControl.value);
  }

  private updateQueryParam(q: string | null): void {
    this.router.navigate([], { queryParams: { q } });
  }

  private setInitialValue(value: string): void {
    this.searchControl.setValue(value);

    if (!value) {
      this.searchControl.markAsUntouched();
    } else {
      this.searchControl.markAsTouched();
    }

    /*
     * If detectChanges is not called,
     * the error messages will not be shown until the user blur the input
     */
    this.changeDetectorRef.detectChanges();
  }

  private focusSearchInput(): void {
    this.searchInput?.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
  }
}

@NgModule({
  imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattIconModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [DhMeteringPointSearchFormComponent],
  exports: [DhMeteringPointSearchFormComponent],
})
export class DhMeteringPointSearchFormScam {}
