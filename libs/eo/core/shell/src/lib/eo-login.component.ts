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
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoAuthService, EoAuthStore } from '@energinet-datahub/eo/shared/services';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { TranslocoService } from '@ngneat/transloco';
import { combineLatest, take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'eo-login',
  imports: [WattSpinnerComponent],
  styles: [
    `
      .spinner {
        display: flex;
        height: 100vh;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  template: `<div class="spinner"><watt-spinner /></div>`,
})
export class EoLoginComponent {
  private service = inject(EoAuthService);
  private store = inject(EoAuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  constructor() {
    this.service.handleLogin();
    combineLatest([this.store.getScope$, this.store.isTokenExpired$])
      .pipe(take(1))
      .subscribe(([scope, isTokenExpired]) => {
        const redirectionPath = this.route.snapshot.queryParamMap.get('redirectionPath');

        console.log('redirectionPath:', redirectionPath);
        console.log('scope', scope);

        if (scope.length == 0) {
          redirectionPath
            ? this.service.startLogin()
            : this.router.navigate(['/', this.transloco.getActiveLang()], {
                queryParamsHandling: 'preserve',
              });
          console.log('scope is empty');
          return;
        }

        if (isTokenExpired) {
          console.log('token expired');
          this.service.logout();
          return;
        }

        if (scope.includes('not-accepted-privacypolicy-terms')) {
          console.log('not-accepted-privacypolicy-terms');
          this.router.navigate(['/terms']);
          return;
        }

        if (scope.includes('dashboard')) {
          console.log('scope includes dashboard');
          const path = redirectionPath ? redirectionPath : '/dashboard';
          window.location.href = window.location.origin + path;
          return;
        }

        console.log('navigate to default');
        this.router.navigate(['/', this.transloco.getActiveLang()], {
          queryParamsHandling: 'preserve',
        });
      });
  }
}
