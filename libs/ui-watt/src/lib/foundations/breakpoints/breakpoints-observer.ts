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
import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { WattBreakpoints } from '@energinet-datahub/watt';
import { Observable } from 'rxjs';

export interface WattBreakpointState {
  /** Whether the breakpoint is currently matching. */
  matches: boolean;
  /**
   * A key boolean pair for each query provided to the observe method,
   * with its current matched state.
   */
  breakpoints: {
    [key in WattBreakpoints]?: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class WattBreakpointsObserver {
  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {}

  observe(
    breakpoints: WattBreakpoints | WattBreakpoints[]
  ): Observable<WattBreakpointState> {
    return this.breakpointObserver.observe(breakpoints);
  }

  isMatched(breakpoint: WattBreakpoints) {
    this.breakpointObserver.isMatched(breakpoint);
  }
}
