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
  ChangeDetectionStrategy,
  EventEmitter,
  ViewEncapsulation,
  Input,
  Output,
} from '@angular/core';

/**
 * Slider for providing a range of values.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-slider',
  styleUrls: ['./watt-slider.component.scss'],
  templateUrl: './watt-slider.component.html',
})
export class WattSliderComponent {
  /** The lowest permitted value. */
  @Input() min = 0;

  /** The greatest permitted value. */
  @Input() max = 100;

  /** The currently selected range value. */
  @Input() value = [this.min, this.max];

  /**
   * Emits value whenever it changes.
   * @ignore
   */
  @Output() valueChange = new EventEmitter<number[]>();

  /**
   * Change handler for updating value.
   * @ignore
   */
  onChange(value: number[]) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
