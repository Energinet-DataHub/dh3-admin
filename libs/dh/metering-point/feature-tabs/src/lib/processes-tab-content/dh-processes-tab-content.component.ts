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
import { Component, NgModule, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { dhMeteringPointIdParam } from '@energinet-datahub/dh/metering-point/routing';
import { WattSpinnerModule } from '@energinet-datahub/watt';
import { LetModule } from '@rx-angular/template';
import { map, Subject, takeUntil } from 'rxjs';
import { DhProcessesDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';
import { DhProcessesTableScam } from './dh-processes-table/dh-processes-table.component';

@Component({
  selector: 'dh-processes-tab-content',
  templateUrl: './dh-processes-tab-content.component.html',
  styleUrls: ['./dh-processes-tab-content.component.scss'],
  providers: [DhProcessesDataAccessApiStore],
})
export class DhProcessesTabContentComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  meteringPointId$ = this.route.params.pipe(
    map((params) => params[dhMeteringPointIdParam] as string)
  );

  constructor(
    private route: ActivatedRoute,
    private store: DhProcessesDataAccessApiStore
  ) {
    this.loadProcessData();
  }

  processes$ = this.store.processes$;
  isLoading$ = this.store.isLoading$;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadProcessData(): void {
    this.meteringPointId$
      .pipe(
        takeUntil(this.destroy$),
        map((meteringPointId) => this.store.loadProcessData(meteringPointId))
      )
      .subscribe();
  }
}

@NgModule({
  declarations: [DhProcessesTabContentComponent],
  imports: [
    CommonModule,
    WattSpinnerModule,
    LetModule,
    DhProcessesTableScam,
  ],
  exports: [DhProcessesTabContentComponent],
})
export class DhProcessesTabContentScam {}
