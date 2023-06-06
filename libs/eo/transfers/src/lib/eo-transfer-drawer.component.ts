import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { WattBadgeComponent } from '@energinet-datahub/watt/badge';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattCardComponent } from '@energinet-datahub/watt/card';
import {
  WattDescriptionListComponent,
  WattDescriptionListItemComponent,
} from '@energinet-datahub/watt/description-list';
import { WATT_DRAWER, WattDrawerComponent } from '@energinet-datahub/watt/drawer';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { EoTransfer } from './eo-transfers.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfer-drawer',
  imports: [
    WATT_DRAWER,
    WattButtonComponent,
    WattBadgeComponent,
    WattCardComponent,
    WattDescriptionListComponent,
    WattDescriptionListItemComponent,
    WattTabsComponent,
    WattTabComponent,
    NgIf,
    DatePipe,
  ],
  standalone: true,
  styles: [``],
  template: `
    <watt-drawer #drawer (closed)="onClose()">
      <watt-drawer-topbar>
        <watt-badge
          type="success"
          *ngIf="transfer && isDateActive(transfer.endDate); else notActive"
        >
          Active
        </watt-badge>
      </watt-drawer-topbar>

      <watt-drawer-heading>
        <h2>{{ transfer?.receiverTin }}</h2>
      </watt-drawer-heading>

      <watt-drawer-actions>
        <watt-button variant="secondary" [disabled]="true">Edit</watt-button>
      </watt-drawer-actions>

      <watt-drawer-content *ngIf="drawer.isOpen">
        <watt-tabs>
          <watt-tab label="Information">
            <watt-card variant="solid"
              ><watt-description-list variant="stack">
                <watt-description-list-item
                  label="Period"
                  value="{{ transfer?.startDate | date : 'dd/MM/yyyy' }} - {{
                    transfer?.endDate | date : 'dd/MM/yyyy'
                  }}"
                >
                </watt-description-list-item>
                <watt-description-list-item
                  label="Receiver TIN/CVR"
                  value="{{ transfer?.receiverTin }}"
                >
                </watt-description-list-item>
                <watt-description-list-item label="ID" value="{{ transfer?.id }}">
                </watt-description-list-item>
              </watt-description-list>
            </watt-card>
          </watt-tab>
        </watt-tabs>
      </watt-drawer-content>
    </watt-drawer>

    <ng-template #notActive><watt-badge type="neutral">Inactive</watt-badge></ng-template>
  `,
})
export class EoTransferDrawerComponent {
  @ViewChild(WattDrawerComponent)
  drawer!: WattDrawerComponent;

  transfer: EoTransfer | undefined;

  open(transfer: EoTransfer): void {
    this.transfer = transfer;
    this.drawer.open();
  }

  onClose() {
    this.drawer.close();
  }

  isDateActive(date: number): boolean {
    return new Date(date).getTime() >= new Date().getTime();
  }
}
