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
import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, Subject, map, tap, filter } from 'rxjs';

import {
  WholesaleBatchHttp,
  MarketParticipantGridAreaHttp,
  BatchRequestDto,
  ProcessType,
  GridAreaDto,
} from '@energinet-datahub/dh/shared/domain';
import { batch } from '@energinet-datahub/dh/wholesale/domain';

import type { WattBadgeType } from '@energinet-datahub-types/watt/badge';

interface State {
  batches?: batch[];
  gridAreas?: GridAreaDto[];
  loadingBatches: boolean;
  loadingSettlementReports: boolean;
  selectedBatch?: batch;
  selectedGridArea?: GridAreaDto;
  loadingCreatingBatch: boolean;
}

const initialState: State = {
  loadingBatches: false,
  loadingSettlementReports: false,
  loadingCreatingBatch: false,
};

@Injectable({
  providedIn: 'root',
})
export class DhWholesaleBatchDataAccessApiStore extends ComponentStore<State> {
  batches$ = this.select((x) => x.batches);
  gridAreas$ = this.select((x) => x.gridAreas).pipe(
    // Ensure gridAreas$ will not emit undefined, which will cause no loading indicator to be shown
    filter((x) => !!x)
  );
  selectedBatch$ = this.select((x) => x.selectedBatch);
  selectedGridArea$ = this.select((x) => x.selectedGridArea);

  creatingBatchSuccessTrigger$: Subject<void> = new Subject();
  creatingBatchErrorTrigger$: Subject<void> = new Subject();

  loadingCreatingBatch$ = this.select((x) => x.loadingCreatingBatch);
  loadingBatches$ = this.select((x) => x.loadingBatches);
  loadingSettlementReports$ = this.select((x) => x.loadingSettlementReports);
  loadingGridAreasErrorTrigger$: Subject<void> = new Subject();
  loadingBatchesErrorTrigger$: Subject<void> = new Subject();
  loadingBatchErrorTrigger$: Subject<void> = new Subject();
  loadingBasisDataErrorTrigger$: Subject<void> = new Subject();
  loadingProcessStepResultsErrorTrigger$: Subject<void> = new Subject();
  loadingActorsErrorTrigger$: Subject<void> = new Subject();

  private document = inject(DOCUMENT);
  private httpClient = inject(WholesaleBatchHttp);
  private marketParticipantGridAreaHttpClient = inject(MarketParticipantGridAreaHttp);

  constructor() {
    super(initialState);
  }

  readonly setLoadingCreatingBatch = this.updater(
    (state, loadingCreatingBatch: boolean): State => ({
      ...state,
      loadingCreatingBatch,
    })
  );

  readonly setBatches = this.updater(
    (state, batches: batch[]): State => ({
      ...state,
      batches: batches,
      loadingBatches: false,
    })
  );

  readonly setLoadingBatches = this.updater(
    (state, loadingBatches: boolean): State => ({
      ...state,
      loadingBatches,
    })
  );

  readonly setLoadingSettlementReports = this.updater(
    (state, loadingBatches: boolean): State => ({
      ...state,
      loadingBatches,
    })
  );

  readonly setGridAreas = this.updater(
    (state, gridAreas: GridAreaDto[]): State => ({
      ...state,
      gridAreas,
    })
  );

  readonly createBatch = this.effect(
    (
      batch$: Observable<{
        gridAreas: string[];
        dateRange: { start: string; end: string };
        processType: ProcessType;
      }>
    ) => {
      return batch$.pipe(
        switchMap((batch) => {
          this.setLoadingCreatingBatch(true);

          const batchRequest: BatchRequestDto = {
            processType: batch.processType,
            gridAreaCodes: batch.gridAreas,
            startDate: batch.dateRange.start,
            endDate: batch.dateRange.end,
          };

          return this.httpClient.v1WholesaleBatchPost(batchRequest).pipe(
            tapResponse(
              () => {
                this.creatingBatchSuccessTrigger$.next();
                this.setLoadingCreatingBatch(false);
              },
              () => {
                this.creatingBatchErrorTrigger$.next();
                this.setLoadingCreatingBatch(false);
              }
            )
          );
        })
      );
    }
  );

  readonly getGridAreas = this.effect(() => {
    return this.marketParticipantGridAreaHttpClient
      .v1MarketParticipantGridAreaGetAllGridAreasGet()
      .pipe(
        tapResponse(
          (gridAreas) => {
            this.setGridAreas(gridAreas);
          },
          () => this.loadingGridAreasErrorTrigger$.next()
        )
      );
  });

  readonly setSelectedBatch = this.updater(
    (state, batch: batch | undefined): State => ({
      ...state,
      selectedBatch: batch,
    })
  );

  readonly setSelectedGridArea = this.updater(
    (state, gridArea: GridAreaDto | undefined): State => ({
      ...state,
      selectedGridArea: gridArea,
    })
  );

  readonly getGridArea$ = (gridAreaCode: string): Observable<GridAreaDto | undefined> => {
    return this.selectedBatch$.pipe(
      map((x) => {
        return x?.gridAreas.filter((gridArea: GridAreaDto) => gridArea.code === gridAreaCode)[0];
      }),
      tap((gridArea) => this.setSelectedGridArea(gridArea))
    );
  };
}
