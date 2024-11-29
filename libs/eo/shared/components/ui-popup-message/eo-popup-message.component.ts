import { Component, HostBinding, Input } from '@angular/core';

import { WattIconComponent } from '@energinet-datahub/watt/icon';

/**
 * Component primarily used for displaying errors
 *
 * <eo-popup-message *ngIf="error" title="There was an error"
 * message="This is an error"></eo-popup-message>
 */

@Component({
  standalone: true,
  imports: [WattIconComponent],
  selector: 'eo-popup-message',
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;
      :host {
        display: block;

        @include watt.media('<Large') {
          .watt-card {
            border-radius: 0;
          }
        }

        &.hidden {
          display: none;
        }
      }

      .container {
        display: flex;
        align-items: flex-start;

        img {
          padding-right: var(--watt-space-m);
        }

        .content {
          flex-direction: column;
          flex-grow: 2;
        }
      }

      .watt-card {
        background-color: var(--watt-color-state-danger-light);
        padding: var(--watt-space-m);
      }

      .close {
        padding-left: var(--watt-space-s);

        mat-icon {
          color: var(--watt-color-primary);
        }
      }
    `,
  ],
  template: `
    <div class="watt-card watt-space-stack-l container">
      <img alt="Danger icon" src="/assets/icons/danger.svg" />
      <div class="content">
        <h4 class="watt-space-stack-s">{{ title }}</h4>
        <p>{{ message }}</p>
      </div>

      <a class="close" (click)="hidden = true"><watt-icon name="close" /></a>
    </div>
  `,
})
export class EoPopupMessageComponent {
  @HostBinding('class.hidden') hidden = false;

  @Input() title = 'We have experienced an issue';
  @Input() message = 'please try again or try reloading the page.';
}
