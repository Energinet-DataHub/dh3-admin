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
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { WattBadgeModule } from '@energinet-datahub/watt/badge';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'dh-message-archive-status',
  template: `<ng-container *transloco="let t; read: 'messageArchive.search'"
    ><container-element [ngSwitch]="this.message">
      <watt-badge *ngSwitchCase="'request'" type="info">{{
        t('sent')
      }}</watt-badge>
      <watt-badge *ngSwitchCase="'response'" type="success">{{
        t('received')
      }}</watt-badge>
      <watt-badge *ngSwitchDefault type="info">{{ this.message }}</watt-badge>
    </container-element>
  </ng-container>`,
})
export class DhMessageArchiveStatusComponent {
  @Input() message?: string | null = null;
}

@NgModule({
  declarations: [DhMessageArchiveStatusComponent],
  exports: [DhMessageArchiveStatusComponent],
  imports: [CommonModule, TranslocoModule, WattBadgeModule],
})
export class DhMessageArchiveStatusComponentScam {}
