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
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@ngneat/transloco';

import {
  EoCookieBannerComponent,
  EoPopupMessageComponent,
} from '@energinet-datahub/eo/shared/atomic-design/feature-molecules';
import { EoFooterComponent } from '@energinet-datahub/eo/shared/atomic-design/ui-organisms';
import { translations } from '@energinet-datahub/eo/translations';

import { EoLandingPageAudienceComponent } from './eo-landing-page-audience.component';
import { EoLandingPageCompanyComponent } from './eo-landing-page-company.component';
import { EoLandingPageHeaderComponent } from './eo-landing-page-header.component';
import { EoLandingPageHeroComponent } from './eo-landing-page-hero.component';
import { EoLandingPageIntroductionComponent } from './eo-landing-page-introduction.component';
import { EoLandingPageNotificationComponent } from './eo-landing-page-notification.component';
import { EoLandingPageOriginOfEnergyComponent } from './eo-landing-page-origin-of-energy.component';
import { EoLandingPagePresenter } from './eo-landing-page.presenter';
import { EoLandingPageWhyComponent } from './why.component';
import { EoLandingPageHowComponent } from './how.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    EoFooterComponent,
    EoLandingPageAudienceComponent,
    EoLandingPageCompanyComponent,
    EoLandingPageHeaderComponent,
    EoLandingPageHeroComponent,
    EoLandingPageIntroductionComponent,
    EoLandingPageNotificationComponent,
    EoLandingPageOriginOfEnergyComponent,
    EoCookieBannerComponent,
    EoPopupMessageComponent,
    NgIf,
    TranslocoPipe,
    EoLandingPageWhyComponent,
    EoLandingPageHowComponent
  ],
  selector: 'eo-landing-page-shell',
  styles: ``,
  template: `
    <eo-landing-page-header />
    <eo-landing-page-hero />
    <eo-landing-page-why />
    <eo-landing-page-how />
  `,
  viewProviders: [EoLandingPagePresenter],
})
export class EoLandingPageShellComponent {
  private presenter = inject(EoLandingPagePresenter);
  private router = inject(Router);

  protected translations = translations;

  @HostBinding('style.--eo-landing-page-content-max-width')
  get cssPropertyContentMaxWidth(): string {
    return `${this.presenter.contentMaxWidthPixels}px`;
  }
  cookiesSet: string | null = null;
  error: {
    title: string;
    message: string;
  } | null = null;

  constructor() {
    this.getCookieStatus();
    this.checkForError();
  }

  getCookieStatus() {
    this.cookiesSet = localStorage.getItem('cookiesAccepted');
  }

  checkForError() {
    this.error = this.router.getCurrentNavigation()?.extras?.state?.error
      ? {
          title: 'An error occurred',
          message: 'There was an error during login. Please try again.',
        }
      : null;
  }
}
