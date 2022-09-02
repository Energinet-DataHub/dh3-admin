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
import { MarketParticipantGridAreaHttp, MarketParticipantGridAreaOverviewHttp } from '@energinet-datahub/dh/shared/domain';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { parseErrorResponse } from './dh-market-participant-error-handling';

interface MarketParticipantGridAreaState {
  isLoading: boolean;

  // Changes
  changes: GridAreaChanges;

  // Validation
  validation?: {
    errorMessage: string;
  };
}

export interface GridAreaChanges {
  name: string;
}

const initialState: MarketParticipantGridAreaState = {
  isLoading: false,
  changes: { name: '' }
};

@Injectable()
export class DhMarketParticipantGridAreaDataAccessApiStore extends ComponentStore<MarketParticipantGridAreaState> {
  isLoading$ = this.select((state) => state.isLoading);
  changes$ = this.select((state) => state.changes);
  validationError$ = this.select((state) => state.validation);

  constructor(
    private gridAreaClient: MarketParticipantGridAreaHttp
  ) {
    super(initialState);
  }

  private readonly handleError = (errorResponse: HttpErrorResponse) =>
    this.patchState({
      validation: {
        errorMessage: parseErrorResponse(errorResponse),
      },
    });
}
