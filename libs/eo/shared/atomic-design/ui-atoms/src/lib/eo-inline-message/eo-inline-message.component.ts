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
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  NgModule,
  ViewEncapsulation,
} from '@angular/core';

export type InlineMessageType =
  | 'danger'
  | 'default'
  | 'info'
  | 'success'
  | 'warning';

const selector = 'eo-inline-message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // View encapsulation is disabled to support block type modifiers on the host element
  encapsulation: ViewEncapsulation.None,
  selector,
  styles: [
    `
      @use '@energinet-datahub/watt/utils' as watt;

      .${selector} {
        @include watt.space-inset-m;

        display: flex;

        background: var(--watt-color-neutral-white);
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
        color: var(--watt-color-primary-dark);

        watt-icon {
          margin-right: var(--watt-space-l);
        }
      }

      .${selector}--info {
        background: var(--watt-color-state-info);
        color: var(--watt-color-neutral-white);
      }

      .${selector}--success {
        background: var(--watt-color-state-success);
        color: var(--watt-color-neutral-white);
      }

      .${selector}--danger {
        background: var(--watt-color-state-danger);
        color: var(--watt-color-neutral-white);
      }

      .${selector}--warning {
        background: var(--watt-color-state-warning);
        color: var(--watt-color-primary-dark);
      }
    `,
  ],
  template: `
    <div>
      <ng-content select="watt-icon"></ng-content>
    </div>

    <div>
      <ng-content></ng-content>
    </div>
  `,
})
export class EoInlineMessageComponent {
  @HostBinding('className')
  get modifierClassName(): string {
    return [
      selector,
      this.type === 'default' ? '' : `${selector}--${this.type}`,
    ].join(' ');
  }

  @Input()
  type: InlineMessageType = 'default';
}

@NgModule({
  declarations: [EoInlineMessageComponent],
  exports: [EoInlineMessageComponent],
})
export class EoInlineMessageScam {}
