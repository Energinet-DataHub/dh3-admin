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
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { filter, map, Observable, switchMap, tap } from 'rxjs';
import {
  MeteringPointHttp,
  Process,
} from '@energinet-datahub/dh/shared/data-access-api';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorState, LoadingState } from './states';
import { DHProcess } from '../model/dh-process';

interface ProcessesState {
  readonly processes: DHProcess[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: ProcessesState = {
  processes: [],
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhProcessesDataAccessApiStore extends ComponentStore<ProcessesState> {
  processes$: Observable<DHProcess[]> = this.select(
    (state) => state.processes
  ).pipe(
    filter((processes) => !!processes),
    map((processes) => processes as DHProcess[])
  );
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  processesNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: MeteringPointHttp) {
    super(initialState);
  }

  readonly loadProcessData = this.effect(
    (meteringPointId: Observable<string>) => {
      return meteringPointId.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(true);
        }),
        switchMap((id) =>
          this.httpClient.v1MeteringPointGetProcessesByGsrnGet(id).pipe(
            tapResponse(
              (processesData) => {
                this.setLoading(false);

                const dhProcesses = processesData.map(
                  (process) => new DHProcess(process)
                );

                // TODO: Remove this when the API has been updated to respect timezones
                dhProcesses.forEach((process) => {
                  process.effectiveDate = process.effectiveDate + 'Z';
                  process.createdDate = process.createdDate + 'Z';
                });

                this.updateProcessesData(dhProcesses);
              },
              (error: HttpErrorResponse) => {
                this.setLoading(false);

                this.handleError(error);
              }
            )
          )
        )
      );
    }
  );

  private updateProcessesData = this.updater(
    (state: ProcessesState, processesData: DHProcess[]): ProcessesState => ({
      ...state,
      processes: processesData,
    })
  );

  private setLoading = this.updater(
    (state, isLoading: boolean): ProcessesState => ({
      ...state,
      requestState: isLoading ? LoadingState.LOADING : LoadingState.LOADED,
    })
  );

  private handleError = (error: HttpErrorResponse) => {
    const processesData: DHProcess[] = [];
    this.updateProcessesData(processesData);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  private resetState = () => this.setState(initialState);
}
