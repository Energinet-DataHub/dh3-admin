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
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { RxPush } from '@rx-angular/template/push';
import { Observable, map, takeUntil } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattCodeComponent } from '@energinet-datahub/watt/code';

import { DhBalanceResponsibleMessage } from '../dh-balance-responsible-message';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';

@Component({
  selector: 'dh-balance-responsible-drawer',
  standalone: true,
  templateUrl: './dh-drawer.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      .message-heading {
        margin: 0;
        margin-bottom: var(--watt-space-s);
      }

      .xml-message-container {
        padding: var(--watt-space-ml);
      }
    `,
  ],
  imports: [
    NgIf,
    TranslocoDirective,
    RxPush,

    WATT_DRAWER,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattDatePipe,
    WattCodeComponent,

    DhEmDashFallbackPipe,
  ],
})
export class DhBalanceResponsibleDrawerComponent {
  private readonly http = inject(HttpClient);

  balanceResponsibleMessage: DhBalanceResponsibleMessage | undefined;
  xmlMessage$: Observable<string> | null = null;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  public open(message: DhBalanceResponsibleMessage): void {
    this.drawer?.open();

    this.balanceResponsibleMessage = message;

    if (this.balanceResponsibleMessage.getStorageDocumentLink) {
      this.xmlMessage$ = this.loadDocument(this.balanceResponsibleMessage.getStorageDocumentLink);
    }
  }

  onClose(): void {
    this.closed.emit();

    this.balanceResponsibleMessage = undefined;
  }

  private loadDocument(documentLink: string): Observable<string> {
    return this.http.get(documentLink, { responseType: 'arraybuffer' }).pipe(
      map((res) => String.fromCharCode(...new Uint8Array(res))),
      takeUntil(this.closed)
    );
  }
}
