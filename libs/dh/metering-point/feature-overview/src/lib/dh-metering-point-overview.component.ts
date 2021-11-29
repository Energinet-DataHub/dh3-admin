/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template';
import { LocalRouterStore } from '@ngworker/router-component-store';
import { map, Subject, takeUntil } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';
import { WattBadgeModule, WattSpinnerModule } from '@energinet-datahub/watt';
import { DhMeteringPointDataAccessApiStore } from '@energinet-datahub/dh/metering-point/data-access-api';

import { DhBreadcrumbScam } from './breadcrumb/dh-breadcrumb.component';
import { dhMeteringPointIdParam } from './routing/dh-metering-point-id-param';
import { DhMeteringPointOverviewPresenter } from './dh-metering-point-overview.presenter';
import { DhMeteringPointNotFoundScam } from './not-found/dh-metering-point-not-found.component';
import { DhMeteringPointServerErrorScam } from './server-error/dh-metering-point-server-error.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-metering-point-overview',
  styleUrls: ['./dh-metering-point-overview.component.scss'],
  templateUrl: './dh-metering-point-overview.component.html',
  viewProviders: [
    LocalRouterStore,
    DhMeteringPointOverviewPresenter,
    DhMeteringPointDataAccessApiStore,
  ],
})
export class DhMeteringPointOverviewComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  meteringPointId$ = this.route.selectRouteParam<string>(
    dhMeteringPointIdParam
  );
  meteringPoint$ = this.store.meteringPoint$;
  meteringPointStatus$ = this.presenter.meteringPointStatus$;
  isLoading$ = this.store.isLoading$;
  meteringPointNotFound$ = this.store.meteringPointNotFound$;
  hasError$ = this.store.hasError$;

  emDash = '—';

  constructor(
    private route: LocalRouterStore,
    private store: DhMeteringPointDataAccessApiStore,
    private presenter: DhMeteringPointOverviewPresenter
  ) {
    this.loadMeteringPointData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadMeteringPointData(): void {
    this.meteringPointId$
      .pipe(
        takeUntil(this.destroy$),
        map((meteringPointId) =>
          this.store.loadMeteringPointData(meteringPointId)
        )
      )
      .subscribe();
  }
}

@NgModule({
  declarations: [DhMeteringPointOverviewComponent],
  imports: [
    CommonModule,
    LetModule,
    TranslocoModule,
    DhBreadcrumbScam,
    DhMeteringPointNotFoundScam,
    DhMeteringPointServerErrorScam,
    WattBadgeModule,
    WattSpinnerModule,
  ],
})
export class DhMeteringPointOverviewScam {}
