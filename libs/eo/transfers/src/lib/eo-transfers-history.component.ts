import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { EoListedTransfer } from './eo-transfers.service';
import { EoActivityLogComponent } from '@energinet-datahub/eo/activity-log';
import { ActivityLogEntryResponse } from '@energinet-datahub/eo/activity-log/data-access-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-transfers-history',
  imports: [EoActivityLogComponent],
  styles: [
    `
      h3,
      watt-empty-state {
        margin-bottom: var(--watt-space-m);
      }

      h3 {
        display: flex;
        align-items: center;
      }

      watt-badge {
        margin-left: var(--watt-space-s);
        border-radius: 50%;
        color: var(--watt-on-light-high-emphasis);
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: 9999px;
        min-width: 28px;
        padding: var(--watt-space-xs) var(--watt-space-s);
      }

      .spinner-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--watt-space-xl);
      }
    `,
  ],
  standalone: true,
  template: `
    <eo-activity-log
      #log
      variant="solid"
      [showFilters]="false"
      [eventTypes]="['TransferAgreement']"
      [filter]="filter.bind(this)"
      [period]="{ start: null, end: null }"
    />
  `,
})
export class EoTransfersHistoryComponent implements OnChanges {
  @Input() transfer?: EoListedTransfer;
  @ViewChild(EoActivityLogComponent) log!: EoActivityLogComponent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transfer']?.currentValue && this.log && this.log.refresh) {
      this.log.refresh();
    }
  }

  filter(logEntries: ActivityLogEntryResponse[]) {
    return logEntries.filter((entry) => {
      return entry.entityId === this.transfer?.id;
    });
  }

  refresh() {
    if (this.log && this.log.refetch) {
      this.log.refetch();
    }
  }
}
