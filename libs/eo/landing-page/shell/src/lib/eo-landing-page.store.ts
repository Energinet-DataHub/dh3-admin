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
import { Injectable, Inject } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, switchMap } from 'rxjs';
import {
  AuthHttp,
  AuthOidcLoginResponse,
} from '@energinet-datahub/ett/auth/data-access-api';
import { AbsoluteUrlGenerator } from '@energinet-datahub/ett/shared/util-browser';
import { ettDashboardRoutePath } from '@energinet-datahub/ett/dashboard/routing';

@Injectable()
export class LandingPageStore extends ComponentStore<LandingPageStateInterface> {
  private readonly absoluteReturnUrl = this.urlGenerator.fromCommands([
    ettDashboardRoutePath,
  ]);

  readonly authenticationUrl$: Observable<AuthOidcLoginResponse> = this.select(
    () => {
      return this.authOidcHttpClient.getLogin(
        this.appBaseHref,
        this.absoluteReturnUrl
      );
    }
  ).pipe(switchMap((response) => response));

  constructor(
    private readonly authOidcHttpClient: AuthHttp,
    private readonly urlGenerator: AbsoluteUrlGenerator,
    @Inject(APP_BASE_HREF) private readonly appBaseHref: string
  ) {
    super(initialState);
  }
}

export interface LandingPageStateInterface {
  next_url: string;
}

const initialState: LandingPageStateInterface = {
  next_url: '',
};
