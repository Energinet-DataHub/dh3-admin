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
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DhMessageArchiveActorDataAccessApiStore,
  DhMessageArchiveDataAccessApiStore,
  DhMessageArchiveDataAccessBlobApiStore,
} from '@energinet-datahub/dh/message-archive/data-access-api';
import { DocumentTypes, ProcessTypes } from '@energinet-datahub/dh/message-archive/domain';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonModule } from '@energinet-datahub/watt/button';
import { WattCheckboxModule } from '@energinet-datahub/watt/checkbox';
import {
  danishTimeZoneIdentifier,
  WattDatepickerModule,
  WattRange,
} from '@energinet-datahub/watt/datepicker';
import { WattDropdownModule, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattFormFieldModule } from '@energinet-datahub/watt/form-field';
import { WattInputModule } from '@energinet-datahub/watt/input';
import { WattSpinnerModule } from '@energinet-datahub/watt/spinner';
import { WattTimepickerModule } from '@energinet-datahub/watt/timepicker';
import { WattTopBarComponent } from '@energinet-datahub/watt/top-bar';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template/let';
import { PushModule } from '@rx-angular/template/push';
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';
import { DhMessageArchiveLogSearchResultComponent } from './searchresult/dh-message-archive-log-search-result.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search',
  styleUrls: ['./dh-message-archive-log-search.component.scss'],
  templateUrl: './dh-message-archive-log-search.component.html',
  providers: [
    DhMessageArchiveDataAccessApiStore,
    DhMessageArchiveDataAccessBlobApiStore,
    DhMessageArchiveActorDataAccessApiStore,
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattCheckboxModule,
    WattDatepickerModule,
    WattTimepickerModule,
    FormsModule,
    CommonModule,
    LetModule,
    TranslocoModule,
    DhMessageArchiveLogSearchResultComponent,
    WattBadgeComponent,
    WattDropdownModule,
    WattSpinnerModule,
    ReactiveFormsModule,
    PushModule,
    WattTopBarComponent,
  ],
})
export class DhMessageArchiveLogSearchComponent {
  searchForm: FormGroup = new FormGroup({
    messageId: new FormControl(''),
    rsmNames: new FormControl([]),
    processTypes: new FormControl([]),
    senderId: new FormControl(''),
    receiverId: new FormControl(''),
    includeRelated: new FormControl<boolean>({ value: false, disabled: true }),
    dateRange: new FormControl<WattRange>({
      start: '',
      end: '',
    }),
    timeRange: new FormControl<WattRange>({
      start: '00:00',
      end: '23:59',
      disabled: true,
    }),
  });

  searchResult$ = this.store.searchResult$;
  searching$ = this.store.isSearching$;
  hasSearchError$ = this.store.hasGeneralError$;
  continuationToken$ = this.store.continuationToken$;
  isInit$ = this.store.isInit$;
  getActorOptions$ = this.actorStore.actors$;

  rsmFormFieldOptions: WattDropdownOptions = this.buildRsmOptions();
  processTypeFormFieldOptions: WattDropdownOptions = this.buildProcessTypesOptions();

  searching = false;
  maxItemCount = 100;

  constructor(
    private store: DhMessageArchiveDataAccessApiStore,
    private actorStore: DhMessageArchiveActorDataAccessApiStore
  ) {
    this.actorStore.getActors();
    this.searchForm.valueChanges.subscribe((value) => this.handleState(value));
  }

  private handleState(formChanges: typeof this.searchForm.value): void {
    const { messageId, dateRange } = formChanges;
    const stopEmitEvent = { emitEvent: false };

    if (messageId) {
      this.searchForm.controls.includeRelated.enable(stopEmitEvent);
    } else {
      this.searchForm.controls.includeRelated.disable(stopEmitEvent);
    }

    if (dateRange?.start != '' && dateRange?.end != '') {
      this.searchForm.controls.timeRange.enable(stopEmitEvent);
    } else {
      this.searchForm.controls.timeRange.disable(stopEmitEvent);
    }
  }

  private buildRsmOptions() {
    return Object.entries(DocumentTypes).map((entry) => ({
      value: entry[0],
      displayValue: `${entry[1]} - ${entry[0]}`,
    }));
  }

  private buildProcessTypesOptions() {
    return Object.entries(ProcessTypes).map((entry) => ({
      value: entry[0],
      displayValue: `${entry[0]} - ${entry[1]}`,
    }));
  }

  onSubmit() {
    if (this.searchForm.valid === false) return;

    const { dateRange, timeRange } = this.searchForm.value;

    const dateTimeFrom = zonedTimeToUtc(dateRange?.start, danishTimeZoneIdentifier);
    const dateTimeTo = zonedTimeToUtc(dateRange?.end, danishTimeZoneIdentifier);

    if (timeRange?.start && timeRange.end && dateRange?.start && dateRange?.end) {
      const [fromHours, fromMinuts] = timeRange.start.split(':');
      const [toHours, toMinutes] = timeRange.end.split(':');

      dateTimeFrom.setHours(fromHours);
      dateTimeFrom.setMinutes(fromMinuts);

      dateTimeTo.setHours(toHours);
      dateTimeTo.setMinutes(toMinutes);
    }

    this.store.searchLogs();
  }

  loadMore(continuationToken?: string | null) {
    console.log({ continuationToken });
  }

  resetSearchCritera() {
    this.store.resetState();
    //TODO: reset form not working
    this.searchForm.reset();
  }
}
