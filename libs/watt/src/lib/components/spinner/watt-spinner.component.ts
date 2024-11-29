import { Component, HostBinding, Input } from '@angular/core';
/**
 * Usage:
 * `import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';`
 */
@Component({
  selector: 'watt-spinner',
  standalone: true,
  styleUrls: ['./watt-spinner.component.scss'],
  template: `<svg class="spinner" viewBox="0 0 50 50">
    <circle class="path" cx="25" cy="25" r="20" fill="none" [attr.stroke-width]="strokeWidth" />
  </svg>`,
})
export class WattSpinnerComponent {
  @HostBinding('attr.role') role = 'progressbar';

  @HostBinding('style')
  get style(): string {
    return `--watt-spinner-diameter: ${this.diameter}px`;
  }

  @Input() diameter = 44;

  @Input() strokeWidth = 5;
}
