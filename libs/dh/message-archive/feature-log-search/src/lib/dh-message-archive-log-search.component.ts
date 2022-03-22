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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LetModule } from '@rx-angular/template';
import { Subject } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import {
  WattButtonModule,
  WattFormFieldModule,
  WattIconModule,
  WattInputModule,
  WattCheckboxModule,
  WattBadgeModule,
} from '@energinet-datahub/watt';
import {
  DhMessageArchiveDataAccessApiStore,
  DhMessageArchiveDataAccessBlobApiStore,
} from '@energinet-datahub/dh/message-archive/data-access-api';
import {
  MessageArchiveSearchCriteria,
  MessageArchiveSearchResultItemDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  BusinessReasonCodes,
  DocumentTypes,
  RoleTypes,
} from '@energinet-datahub/dh/message-archive/domain';

import { DhMessageArchiveLogSearchResultScam } from './searchresult/dh-message-archive-log-search-result.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-message-archive-log-search',
  styleUrls: ['./dh-message-archive-log-search.component.scss'],
  templateUrl: './dh-message-archive-log-search.component.html',
  providers: [
    DhMessageArchiveDataAccessApiStore,
    DhMessageArchiveDataAccessBlobApiStore,
  ],
})
export class DhMessageArchiveLogSearchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private regexBlobName = new RegExp(
    /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\/.*/
  );

  searchResult$ = this.store.searchResult$;
  searching$ = this.store.isSearching$;
  hasSearchError$ = this.store.hasGeneralError$;
  continuationToken$ = this.store.continuationToken$;

  businessReasonCodes = BusinessReasonCodes;
  searching = false;
  documentTypes = DocumentTypes;
  roleTypes = RoleTypes;
  pageSizes = [250, 500, 750, 1000];
  pageNumber = 1;
  searchCriteria: MessageArchiveSearchCriteria = {
    messageId: null,
    reasonCode: null,
    senderRoleType: null,
    rsmName: null,
    includeRelated: false,
    traceId: null,
    functionName: null,
    invocationId: null,
    maxItemCount: 250,
  };

  private initDateFrom = (): Date => {
    const from = new Date();
    from.setUTCMonth(new Date().getMonth() - 1);
    from.setUTCHours(0, 0, 0);
    return from;
  };
  private initDateTo = (): Date => {
    const to = new Date();
    to.setUTCHours(23, 59, 59);
    return to;
  };

  constructor(
    private store: DhMessageArchiveDataAccessApiStore,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private logStore: DhMessageArchiveDataAccessBlobApiStore
  ) {
    this.currentRoute.queryParamMap.subscribe((q) => {
      this.searchCriteria.traceId = q.has('traceId') ? q.get('traceId') : null;
      this.searchCriteria.functionName = q.has('functionName')
        ? q.get('functionName')
        : null;
      this.searchCriteria.invocationId = q.has('invocationId')
        ? q.get('invocationId')
        : null;
    });

    this.searchCriteria.dateTimeFrom =
      this.initDateFrom().toISOString().split('.')[0] + 'Z';
    this.searchCriteria.dateTimeTo =
      this.initDateTo().toISOString().split('.')[0] + 'Z';
  }

  onSubmit() {
    if (!this.searching && this.validateSearchParams()) {
      this.searchCriteria.continuationToken = null;
      this.pageNumber = 1;

      if (!this.searchCriteria.messageId) {
        this.searchCriteria.includeRelated = false;
      }

      this.store.searchLogs(this.searchCriteria);
    }
  }

  nextPage() {
    if (!this.searching && this.validateSearchParams()) {
      this.store.searchLogs(this.searchCriteria);
      this.pageNumber++;
    }
  }

  redirectToDownloadLogPage(resultItem: MessageArchiveSearchResultItemDto) {
    const blobName = this.findBlobName(resultItem.blobContentUri);
    const encodedBlobName = encodeURIComponent(blobName);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/message-archive/${encodedBlobName}`])
    );
    const blobViewWindow = window.open(url, '_blank');
    blobViewWindow?.sessionStorage.setItem(
      'messageId',
      resultItem.messageId ?? ''
    );
  }

  downloadLog(resultItem: MessageArchiveSearchResultItemDto) {
    const blobName = this.findBlobName(resultItem.blobContentUri);
    this.logStore.downloadLogFile(blobName);
  }

  validateSearchParams(): boolean {
    return (
      this.searchCriteria.dateTimeFrom != null &&
      this.searchCriteria.dateTimeTo != null &&
      this.searchCriteria.dateTimeFrom.length === 20 &&
      this.searchCriteria.dateTimeTo.length === 20
    );
  }

  findBlobName(blobUrl: string): string {
    if (this.regexBlobName.test(blobUrl)) {
      const match = this.regexBlobName.exec(blobUrl);
      return match != null ? match[0] : '';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
@NgModule({
  imports: [
    WattFormFieldModule,
    WattInputModule,
    WattButtonModule,
    WattIconModule,
    WattCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LetModule,
    TranslocoModule,
    DhMessageArchiveLogSearchResultScam,
    WattBadgeModule,
  ],
  declarations: [DhMessageArchiveLogSearchComponent],
})
export class DhMessageArchiveLogSearchScam {}
