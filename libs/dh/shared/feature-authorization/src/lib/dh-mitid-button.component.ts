import { Component, inject, input, signal } from '@angular/core';

import { dhB2CEnvironmentToken } from '@energinet-datahub/dh/shared/environments';
import { MSALInstanceFactory } from '@energinet-datahub/dh/auth/msal';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhFeatureFlagDirective } from '@energinet-datahub/dh/shared/feature-flags';
import { mutation } from '@energinet-datahub/dh/shared/util-apollo';
import { InitiateMitIdSignupDocument } from '@energinet-datahub/dh/shared/domain/graphql';

@Component({
  selector: 'dh-mitid-button',
  standalone: true,
  imports: [WattSpinnerComponent, WattButtonComponent, DhFeatureFlagDirective],
  styles: [
    `
      watt-button {
        padding: 16px 0 0 0;
      }

      .mitid-link {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--mitid-color);
        color: var(--watt-on-dark-high-emphasis);
        border-radius: 4px;
        height: 44px;
        padding: 0 1rem;
        text-decoration: none;

        &:hover {
          background-color: var(--mitid-color-hover);
        }

        &:active {
          background-color: var(--mitid-color);
        }
      }

      .mitid-label {
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
      }

      watt-spinner {
        --watt-spinner-circle-color: var(--watt-color-neutral-white);
      }
    `,
  ],
  template: `
    <a class="mitid-link" (click)="redirectToMitIdSignup()" tabindex="0">
      @if (isLoading()) {
        <watt-spinner [diameter]="24" />
      } @else {
        <span class="mitid-label">
          <ng-content />
        </span>
      }
    </a>
  `,
})
export class DhMitIDButtonComponent {
  private config = inject(dhB2CEnvironmentToken);
  private initiateMitIdSignupMutation = mutation(InitiateMitIdSignupDocument);

  isLoading = signal(false);

  mode = input.required<'signup' | 'login'>();

  redirectToMitIdSignup() {
    this.isLoading.set(true);

    if (this.mode() === 'login') {
      this.redirectToMitID();
    } else {
      this.initiateMitIdSignupMutation.mutate({
        onCompleted: () => this.redirectToMitID(),
      });
    }
  }

  private async redirectToMitID() {
    const instance = MSALInstanceFactory({
      ...this.config,
      authority: this.config.mitIdFlowUri,
    });

    await instance.initialize();
    await instance.loginRedirect();
  }
}
