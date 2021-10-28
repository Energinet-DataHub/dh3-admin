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
import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { WattIcon, WattIconSize } from '../../foundations/icon';

/**
 * Usage:
 * `import { WattEmptyStateModule } from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-empty-state',
  styleUrls: ['./empty-state.component.scss'],
  templateUrl: './empty-state.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class WattEmptyStateComponent {
  @Input() icon?: WattIcon;
  @Input() size: 'Small' | 'Large' = 'Large';
  @Input() title = '';
  @Input() message = '';

  @HostBinding('class') get currentSize(): string[] {
    return [`empty-state-${this.size}`];
  }

  get iconSize(): WattIconSize {
    if (this.size === 'Small') {
      return 'XLarge';
    }

    return 'XXLarge';
  }

  get hasIcon(): boolean {
    return !!this.icon;
  }
}
