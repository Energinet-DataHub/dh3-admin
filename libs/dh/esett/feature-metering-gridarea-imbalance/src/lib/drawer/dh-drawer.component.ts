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
import { Component, ViewChild, Output, EventEmitter, inject } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';
import { RxPush } from '@rx-angular/template/push';
import { Observable, switchMap, takeUntil } from 'rxjs';

import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WattDatePipe } from '@energinet-datahub/watt/date';
import { WattCodeComponent } from '@energinet-datahub/watt/code';
import { DhEmDashFallbackPipe } from '@energinet-datahub/dh/shared/ui-util';
import { EsettExchangeHttp } from '@energinet-datahub/dh/shared/domain';
import { DhMeteringGridAreaImbalance } from '../dh-metering-gridarea-imbalance';

@Component({
  selector: 'dh-metering-grid-imbalance-drawer',
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
export class DhMeteringGridAreaImbalanceDrawerComponent {
  private readonly esettHttp = inject(EsettExchangeHttp);

  meteringGridAreaImbalance: DhMeteringGridAreaImbalance | null = null;
  xmlMessage$: Observable<string> | null = null;

  @ViewChild(WattDrawerComponent)
  drawer: WattDrawerComponent | undefined;

  @Output() closed = new EventEmitter<void>();

  public open(message: DhMeteringGridAreaImbalance): void {
    this.drawer?.open();

    this.meteringGridAreaImbalance = message;

    if (this.meteringGridAreaImbalance !== null && this.meteringGridAreaImbalance.id) {
      this.xmlMessage$ = this.loadDocument(this.meteringGridAreaImbalance.id);
    }
  }

  onClose(): void {
    this.closed.emit();
    this.meteringGridAreaImbalance = null;
  }

  private loadDocument(documentLink: string): Observable<string> {
    return this.esettHttp.v1EsettExchangeStorageDocumentGet(documentLink).pipe(
      switchMap((res) => {
        const blobPart = res as unknown as BlobPart;
        const blob = new Blob([blobPart]);
        return new Response(blob).text();
      }),
      takeUntil(this.closed)
    );
  }
}
