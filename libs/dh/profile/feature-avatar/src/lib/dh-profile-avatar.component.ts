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
import { MatMenuModule } from '@angular/material/menu';
import { Component, ViewEncapsulation, inject } from '@angular/core';

import { MsalService } from '@azure/msal-angular';

import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { TranslocoDirective } from '@ngneat/transloco';

@Component({
  selector: 'dh-profile-avatar',
  standalone: true,
  imports: [MatMenuModule, WattIconComponent, TranslocoDirective],
  encapsulation: ViewEncapsulation.None,
  template: `<button [matMenuTriggerFor]="menu" class="watt-text-m">D</button>
    <mat-menu #menu="matMenu" xPosition="before" class="dh-profile__menu">
      <ng-container *transloco="let transloco; read: 'shell'">
        <button mat-menu-item>
          <watt-icon name="account" class="watt-icon--small" />
          <span>{{ transloco('profile') }}</span>
        </button>
        <button mat-menu-item (click)="logout()">
          <watt-icon name="logout" class="watt-icon--small" />
          <span>{{ transloco('logout') }}</span>
        </button>
      </ng-container>
    </mat-menu>`,
  styles: `
  .dh-profile__menu {
    width: 200px;
    margin-top: var(--watt-space-s);
    watt-button.watt-button--text.toolbar__logout .mat-mdc-button.mat-text {
        color: var(--typography-color-enabled, #212121);
      }
    .mat-mdc-menu-item-text {
      display: flex;
    }
  }
  dh-profile-avatar {
    display: block;
    button {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      background-color: #424242;
      text-align: center;
      line-height: 40px;
      color:#fff;
      cursor: pointer;
      border:none;
    }
  }`,
})
export class DhProfileAvatarComponent {
  private readonly _authService = inject(MsalService);
  logout() {
    this._authService.logoutRedirect();
  }
}
