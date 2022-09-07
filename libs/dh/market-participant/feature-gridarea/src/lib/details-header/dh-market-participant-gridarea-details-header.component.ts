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
import {
  Component,
  Input,
  NgModule,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import {
  GridAreaChanges,
  GridAreaOverviewRow,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import {
  WattModalModule,
  WattFormFieldModule,
  WattInputModule,
  WattButtonModule,
  WattModalComponent,
} from '@energinet-datahub/watt';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { DhEmDashFallbackPipeScam } from '@energinet-datahub/dh/metering-point/shared/ui-util';
import { DhSharedUiDateTimeModule } from '@energinet-datahub/dh/shared/ui-date-time';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'dh-market-participant-gridarea-details-header',
  styleUrls: ['./dh-market-participant-gridarea-details-header.component.scss'],
  templateUrl: './dh-market-participant-gridarea-details-header.component.html',
})
export class DhMarketParticipantGridAreaDetailsHeaderComponent
  implements OnChanges
{
  @Input() gridArea?: GridAreaOverviewRow;
  @ViewChild('nameChangeModal') nameChangeModal!: WattModalComponent;

  @Input() gridChanges!: (changes: {
    gridAreaChanges: GridAreaChanges;
    onCompleted: () => void;
  }) => void;

  nameChangeForm = new UntypedFormControl('');
  newGridName = '';
  editGridNameEditOpen = false;

  openEditModal = () => {
    this.editGridNameEditOpen = true;
    this.newGridName = this.gridArea?.name ?? '';
    //this.nameChangeModal.open();
  };

  closeEditModal = ($event: Event) => {
    this.editGridNameEditOpen = false;
    //this.nameChangeModal.close(true);
    $event.stopPropagation();
  };

  saveGridChanges = ($event: Event) => {
    if (this.gridArea && this.newGridName && this.newGridName.trim() != '') {
      const gridArea = this.gridArea;
      this.gridChanges({
        gridAreaChanges: { id: this.gridArea.id, name: this.newGridName },
        onCompleted: () => {
          gridArea.name = this.newGridName;
          this.closeEditModal($event);
        },
      });
    }
  };

  ngOnChanges(): void {
    this.newGridName = '';
    this.editGridNameEditOpen = false;
  }
}

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    DhEmDashFallbackPipeScam,
    DhSharedUiDateTimeModule,
    MatDividerModule,
    WattButtonModule,
    WattModalModule,
    WattFormFieldModule,
    WattInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [DhMarketParticipantGridAreaDetailsHeaderComponent],
  exports: [DhMarketParticipantGridAreaDetailsHeaderComponent],
})
export class DhMarketParticipantGridAreaDetailsHeaderScam {}
