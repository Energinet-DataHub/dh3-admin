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
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {
  EoIdleTimerCountdownModalComponent,
  EoIdleTimerLoggedOutModalComponent,
} from '@energinet-datahub/eo/shared/atomic-design/ui-atoms';
import { Subscription, fromEvent, merge, startWith, switchMap, timer } from 'rxjs';
import { EoAuthService } from '../auth/auth.service';

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

  constructor(private dialog: MatDialog, private authService: EoAuthService) {}

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

    this.dialog
      .open(EoIdleTimerCountdownModalComponent, {
        height: '500px',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result: string) => {
        if (result === 'logout') {
          this.authService.logout();
          this.dialog.open(EoIdleTimerLoggedOutModalComponent, {
            height: '500px',
            autoFocus: false,
          });
          return;
        }

        this.startMonitor();
      });
  }
}
