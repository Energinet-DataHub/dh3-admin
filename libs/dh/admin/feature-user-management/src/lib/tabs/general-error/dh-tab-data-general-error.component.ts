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
  EventEmitter,
  Output,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

import { WattEmptyStateModule } from '@energinet-datahub/watt/empty-state';
import { WattButtonModule } from '@energinet-datahub/watt/button';

@Component({
  selector: 'dh-tab-data-general-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *transloco="let t; read: 'admin.userManagement.tabs.errors.generalError'"
    >
      <watt-empty-state
        icon="custom-power"
        [title]="t('title')"
        [message]="t('message')"
      >
        <watt-button (click)="reload.emit()" variant="primary">{{
          t('button')
        }}</watt-button>
      </watt-empty-state>
    </ng-container>
  `,
  imports: [TranslocoModule, WattButtonModule, WattEmptyStateModule],
})
export class DhTabDataGeneralErrorComponent {
  @Output() reload = new EventEmitter<void>();
}
