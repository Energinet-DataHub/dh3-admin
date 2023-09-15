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
import { Component, Input, ViewChild } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import {
  GridAreaChanges,
  GridAreaOverviewRow,
} from '@energinet-datahub/dh/market-participant/data-access-api';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { FormsModule } from '@angular/forms';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';

@Component({
  selector: 'dh-market-participant-gridarea-edit',
  styleUrls: ['./dh-market-participant-gridarea-edit.component.scss'],
  templateUrl: './dh-market-participant-gridarea-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    WattButtonComponent,
    WATT_MODAL,
    FormsModule,
    DhPermissionRequiredDirective,
    WattTextFieldComponent,
  ],
})
export class DhMarketParticipantGridAreaEditComponent {
  @Input() gridArea?: GridAreaOverviewRow;
  @Input() gridChanges!: (changes: {
    gridAreaChanges: GridAreaChanges;
    onCompleted: () => void;
  }) => void;
  @Input() gridChangesLoading = false;
  @Input() getGridAreaData!: (gridAreaId: string) => void;
  @ViewChild('nameChangeModal') nameChangeModal!: WattModalComponent;

  newGridName = '';

  openEditModal = () => {
    this.newGridName = this.gridArea?.name ?? '';
    this.nameChangeModal.open();
  };

  closeEditModal = () => {
    this.nameChangeModal.close(true);
  };

  saveGridChanges = () => {
    if (this.gridArea && this.newGridName && this.newGridName.trim() != '') {
      const gridArea = this.gridArea;
      this.gridChanges({
        gridAreaChanges: { id: this.gridArea.id, name: this.newGridName },
        onCompleted: () => {
          gridArea.name = this.newGridName;
          this.closeEditModal();
          this.getGridAreaData(gridArea.id);
        },
      });
    }
  };
}
