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
/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, fromEvent, merge, startWith, switchMap, timer } from 'rxjs';

import { WattModalService } from '@energinet-datahub/watt/modal';

import { EoAuthService } from '../auth/auth.service';
import {
  EoIdleTimerCountdownModalComponent,
  EoIdleTimerLoggedOutModalComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';

@Injectable({
  providedIn: 'root',
})
export class IdleTimerService {
  allowedInactiveTime = 900000; // 15 minutes in milliseconds
  dialogRef: MatDialogRef<EoIdleTimerCountdownModalComponent> | undefined;
  subscription$: Subscription | undefined;
  monitoredEvents$ = merge(
    fromEvent(document, 'visibilitychange'),
    fromEvent(document, 'click'),
    fromEvent(document, 'keyup')
  );

  constructor(private authService: EoAuthService, private modalService: WattModalService) {}

  attachMonitorsWithTimer() {
    return this.monitoredEvents$.pipe(
      startWith(0), // Starts timer, no matter if user already interacted or not
      switchMap(() => timer(this.allowedInactiveTime))
    );
  }

  startMonitor() {
    this.subscription$ = this.attachMonitorsWithTimer().subscribe(() => this.showLogoutWarning());
  }

  stopMonitor() {
    this.subscription$?.unsubscribe();
  }

  private showLogoutWarning() {
    this.stopMonitor();

    this.modalService.open({
      component: EoIdleTimerCountdownModalComponent,
      onClosed: (logout: boolean) => {
        if (logout) {
          this.authService.logout();
          setTimeout(() => {
            this.showLogoutConfirmation();
          });

          return;
        }

        this.startMonitor();
      }
    })
  }

  private showLogoutConfirmation() {
    this.modalService.open({
      component: EoIdleTimerLoggedOutModalComponent,
    });
  }
}
