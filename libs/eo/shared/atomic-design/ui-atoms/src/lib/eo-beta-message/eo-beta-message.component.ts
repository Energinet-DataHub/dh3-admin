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
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WattButtonComponent } from '@energinet-datahub/watt/button';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'eo-eo-beta-message',
  standalone: true,
  imports: [CommonModule, WattButtonComponent],
  templateUrl: './eo-beta-message.component.html',
  styleUrls: ['./eo-beta-message.component.scss'],
})
export class EoBetaMessageComponent {
  isVisible = true;

  closeMessage() {
    this.isVisible = false;
  }
}
