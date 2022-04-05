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
  Output,
  NgModule,
  OnChanges,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { DhMarketParticipantOverviewDataAccessApiStore } from '@energinet-datahub/dh/market-participant/data-access-api';
import { TranslocoModule } from '@ngneat/transloco';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import {
  WattButtonModule,
  WattInputModule,
  WattFormFieldModule,
  WattDropdownModule,
  WattDropdownOption,
} from '@energinet-datahub/watt';

interface ContactChanges {
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface EditableContactRow {
  contact: ContactChanges;
  changed: ContactChanges;
  isExisting: boolean;
  isModified: boolean;
  isNewPlaceholder: boolean;
}

@Component({
  selector: 'dh-market-participant-organization-contact-data',
  styleUrls: [
    './dh-market-participant-organization-contact-data.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl:
    './dh-market-participant-organization-contact-data.component.html',
  providers: [DhMarketParticipantOverviewDataAccessApiStore],
})
export class DhMarketParticipantOrganizationContactDataComponent
  implements OnChanges
{
  constructor(private cd: ChangeDetectorRef) {}

  @Input() contacts: ContactChanges[] = [];
  @Output() contactsChanged = new EventEmitter<{
    add: ContactChanges[];
    remove: ContactChanges[];
  }>();

  columnIds = ['Type', 'Name', 'Email', 'Phone', 'Delete'];

  contactTypes: WattDropdownOption[] = [
    {
      displayValue: 'Firmakontakt',
      value: 'Type A',
    },
    {
      displayValue: 'Anden kontakt',
      value: 'Type 3',
    },
  ];

  contactRows: EditableContactRow[] = [];
  deletedContacts: ContactChanges[] = [];

  ngOnChanges() {
    this.contactRows = this.contacts
      .map(
        (contact): EditableContactRow => ({
          isExisting: true,
          isModified: false,
          isNewPlaceholder: false,
          contact: contact,
          changed: {
            type: contact.type,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
          },
        })
      )
      .concat([this.createPlaceholder()]);
  }

  readonly onRowDelete = (row: EditableContactRow) => {
    if (row.isExisting) {
      this.deletedContacts = [...this.deletedContacts, row.contact];
    }

    const copy = [...this.contactRows];
    const index = copy.indexOf(row);
    copy.splice(index, 1);
    this.contactRows = copy;

    this.cd.detectChanges();
    this.raiseContactsChanged();
  };

  readonly onFieldChanged = (row: EditableContactRow) => {
    if (row.isNewPlaceholder) {
      row.isNewPlaceholder = false;
      this.contactRows = [...this.contactRows, this.createPlaceholder()];
    }

    row.isModified =
      row.changed.type !== row.contact.type ||
      row.changed.name !== row.contact.name ||
      row.changed.email !== row.contact.email ||
      row.changed.phone !== row.contact.phone;

    this.cd.detectChanges();
    this.raiseContactsChanged();
  };

  readonly raiseContactsChanged = () => {
    const oldModified = this.contactRows
      .filter((row) => row.isModified)
      .filter((row) => row.isExisting)
      .map((row) => row.contact);

    const newModified = this.contactRows
      .filter((row) => row.isModified)
      .filter((row) => !row.isNewPlaceholder)
      .map((row) => row.changed);

    this.contactsChanged.emit({
      add: newModified,
      remove: this.deletedContacts.concat(oldModified),
    });
  };

  readonly createPlaceholder = (): EditableContactRow => {
    return {
      isExisting: false,
      isModified: false,
      isNewPlaceholder: true,
      contact: { type: '', name: '', email: '', phone: '' },
      changed: { type: '', name: '', email: '', phone: '' },
    };
  };
}

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    FormsModule,
    MatTableModule,
    WattButtonModule,
    WattInputModule,
    WattFormFieldModule,
    WattDropdownModule,
  ],
  exports: [DhMarketParticipantOrganizationContactDataComponent],
  declarations: [DhMarketParticipantOrganizationContactDataComponent],
})
export class DhMarketParticipantOrganizationContactDataComponentScam {}
