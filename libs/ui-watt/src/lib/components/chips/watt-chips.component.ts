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
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

export interface WattChipsOption {
  label: string;
  value: string;
}

export type WattChipsSelection = string | null;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-chips',
  styleUrls: ['./watt-chips.component.scss'],
  templateUrl: './watt-chips.component.html',
})
export class WattChipsComponent {
  @Input() options: WattChipsOption[] = [];
  @Input() selection: WattChipsSelection = null;
  @Output() selectionChange = new EventEmitter<WattChipsSelection>();

  /**
   * @ignore
   */
  onClick(selection: WattChipsSelection) {
    this.selection = this.selection === selection ? null : selection;
    this.selectionChange.emit(this.selection);
  }
}
