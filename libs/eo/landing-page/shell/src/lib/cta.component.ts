import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { EoAuthService } from '@energinet-datahub/eo/auth/data-access';
import { eoApiEnvironmentToken } from '@energinet-datahub/eo/shared/environments';
import { translations } from '@energinet-datahub/eo/translations';
import { EoLoginButtonComponent } from './login-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WattIconComponent, TranslocoPipe, EoLoginButtonComponent],
  selector: 'eo-landing-page-cta',
  styles: `
    :host {
      display: block;
      width: 100%;
      padding: 48px 32px;
      background: #fff;
      display: grid;
      grid-template-areas:
        'heading'
        'login'
        'devportal';
      gap: 64px;

      @media (min-width: 895px) {
        padding: 212px 14vw;
        grid-template-areas:
          'heading heading . .'
          'login devportal . .';
        gap: 58px;
      }
    }

    .headline-1 {
      color: rgba(0, 0, 0, 0.87);
    }

    .headline-3 {
      color: rgba(0, 0, 0, 0.87);
    }

    h2 {
      grid-area: heading;
    }

    h3 {
      margin-bottom: 30px;
    }

    .login {
      grid-area: login;
    }

    .devportal {
      grid-area: devportal;
    }

    section {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
    }
  `,
  template: `
    <h2 class="headline-1">{{ translations.landingPage.cta.heading | transloco }}</h2>
    <section class="login">
      <h3 class="headline-3">{{ translations.landingPage.cta.section1.heading | transloco }}</h3>
      <eo-login-button />
    </section>
    <section class="devportal">
      <h3 class="headline-3">{{ translations.landingPage.cta.section2.heading | transloco }}</h3>
      <a [href]="devPortalHref" target="_blank" class="button primary"
        ><watt-icon name="openInNew" />{{
          translations.landingPage.cta.section2.cta | transloco
        }}</a
      >
    </section>
  `,
})
export class EoLandingPageCTAComponent {
  private authService = inject(EoAuthService);

  protected devPortalHref: string = inject(eoApiEnvironmentToken).developerPortal;
  protected translations = translations;

  onLogin(): void {
    this.authService.login();
  }
}
