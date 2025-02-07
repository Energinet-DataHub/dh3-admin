//#region License
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
//#endregion
import { Component, ViewEncapsulation, computed, input } from '@angular/core';

import { WattIcon, WattIconComponent } from '../../foundations/icon';
import { WattIconSize } from '../../foundations/icon/watt-icon-size';

/**
 * Usage:
 * `import { WattEmptyStateComponent } from '@energinet-datahub/watt/empty-state';`
 */
@Component({
  selector: 'watt-empty-state',
  encapsulation: ViewEncapsulation.None,
  imports: [WattIconComponent],
  styles: `
    @use '@energinet-datahub/watt/utils' as watt;

    watt-empty-state {
      display: block;
      text-align: center;
      color: var(--watt-color-primary-dark);

      h3,
      h5,
      p {
        margin: 0;
        white-space: pre-wrap;
      }

      watt-button {
        display: block;
        margin-top: var(--watt-space-m);

        &:first-of-type {
          margin-top: var(--watt-space-l);
        }
      }
    }
  `,
  template: `
    @if (hasIcon()) {
      <watt-icon [name]="icon()" [size]="iconSize()" class="watt-space-stack-l" />
    }

    @if (size() === 'large') {
      <h3>{{ title() }}</h3>
    } @else {
      <h5>{{ title() }}</h5>
    }

    @if (useHTML()) {
      <div [class.watt-text-s]="size() === 'small'" [innerHTML]="message()"></div>
    } @else {
      <p [class.watt-text-s]="size() === 'small'">{{ message() }}</p>
    }

    <ng-content />
  `,
})
export class WattEmptyStateComponent {
  icon = input<WattIcon>();
  size = input<'small' | 'large'>('large');
  title = input('');
  message = input('');
  useHTML = input(false);

  iconSize = computed<WattIconSize>(() => {
    if (this.size() === 'small') {
      return 'xl';
    }

    return 'xxl';
  });

  hasIcon = computed(() => !!this.icon());
}
