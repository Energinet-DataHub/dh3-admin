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
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import dayjs from 'dayjs';
import { RxLet } from '@rx-angular/template/let';

@Component({
  selector: 'dh-user-latest-login',
  standalone: true,
  template: `
    <ng-container *transloco="let t; read: 'admin.userManagement.tabs.users'">
      <ng-container *rxLet="getDaysSince(latestLoginAt()) as days">
        @switch (days) {
          @case (null) {
            <watt-badge type="danger">{{ t('never') }}</watt-badge>
          }
          @case (0) {
            <watt-badge type="info">{{ t('today') }}</watt-badge>
          }
          @case (1) {
            <watt-badge type="info">{{ t('yesterday') }}</watt-badge>
          }
          @default {
            <watt-badge [type]="(days > 30 && 'warning') || 'info'">{{
              t('daysAgo', { days })
            }}</watt-badge>
          }
        }
      </ng-container>
    </ng-container>
  `,
  imports: [TranslocoDirective, WattBadgeComponent, RxLet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DhUserLatestLoginComponent {
  latestLoginAt = input<Date | null>();

  getDaysSince(date: Date | null | undefined): number | null {
    return date ? dayjs(new Date()).diff(date, 'days') : null;
  }
}
