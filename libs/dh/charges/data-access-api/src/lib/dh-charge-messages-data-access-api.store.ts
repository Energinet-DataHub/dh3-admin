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
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ChargeMessagesSearchCriteriaV1Dto,
  ChargeMessagesV1Dto,
  ChargeMessageV1Dto,
  ChargesHttp,
} from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap } from 'rxjs';
import {
  ErrorState,
  LoadingState,
} from '@energinet-datahub/dh/shared/data-access-api';

interface ChargeMessagesState {
  readonly chargeMessages?: Array<ChargeMessageV1Dto>;
  readonly totalCount: number;
  readonly requestState: LoadingState | ErrorState;
}

const initialState: ChargeMessagesState = {
  chargeMessages: [],
  totalCount: 0,
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhChargeMessagesDataAccessApiStore extends ComponentStore<ChargeMessagesState> {
  all$ = this.select((state) => state.chargeMessages);
  totalCount$ = this.select((state) => state.totalCount);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select(
    (state) => state.requestState === LoadingState.LOADING
  );
  chargeMessagesNotFound$ = this.select(
    (state) => state.requestState === ErrorState.NOT_FOUND_ERROR
  );
  hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  constructor(private httpClient: ChargesHttp) {
    super(initialState);
  }

  readonly searchChargeMessages = this.effect(
    (searchCriteria: Observable<ChargeMessagesSearchCriteriaV1Dto>) => {
      return searchCriteria.pipe(
        tap(() => {
          this.resetState();

          this.setLoading(LoadingState.LOADING);
        }),
        switchMap((searchCriteria) =>
          this.httpClient
            .v1ChargesSearchChargeMessagesAsyncPost(searchCriteria)
            .pipe(
              tapResponse(
                (result) => {
                  this.updateStates(result);
                },
                (error: HttpErrorResponse) => {
                  this.setLoading(LoadingState.LOADED);
                  this.handleError(error);
                }
              )
            )
        )
      );
    }
  );

  private update = this.updater(
    (
      state: ChargeMessagesState,
      chargeMessages: ChargeMessagesV1Dto
    ): ChargeMessagesState => ({
      ...state,
      chargeMessages: chargeMessages.chargeMessages ?? undefined,
      totalCount: chargeMessages.totalCount,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): ChargeMessagesState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private updateStates = (chargeMessages: ChargeMessagesV1Dto) => {
    this.update(chargeMessages);

    if (chargeMessages.totalCount == 0) {
      this.patchState({ requestState: ErrorState.NOT_FOUND_ERROR });
    } else {
      this.patchState({ requestState: LoadingState.LOADED });
    }
  };

  private handleError = (error: HttpErrorResponse) => {
    const chargesMessages = {
      chargesMessages: undefined,
      totalCount: 0,
    };
    this.update(chargesMessages);

    const requestError =
      error.status === HttpStatusCode.NotFound
        ? ErrorState.NOT_FOUND_ERROR
        : ErrorState.GENERAL_ERROR;

    this.patchState({ requestState: requestError });
  };

  readonly clearChargeMessages = () => {
    this.setLoading(LoadingState.INIT);
    const chargesMessages = {
      chargesMessages: undefined,
      totalCount: 0,
    };
    this.update(chargesMessages);
  };
  private resetState = () => this.setState(initialState);
}
