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
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { WattDrawerContentDirective } from './watt-drawer-content.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-drawer',
  styleUrls: ['./watt-drawer.component.scss'],
  templateUrl: './watt-drawer.component.html',
})
export class WattDrawerComponent {
  @ContentChild(WattDrawerContentDirective)
  content?: WattDrawerContentDirective;

  @ViewChild('contentVcr', { read: ViewContainerRef, static: false })
  private contentVcr?: ViewContainerRef;

  private _isOpened = false;

  @Input() set opened(isOpened: boolean) {
    if (isOpened) {
      this._isOpened = true;

      if (this.content) {
        this.contentVcr?.createEmbeddedView(this.content.tpl);
      }
    } else {
      this._isOpened = false;

      this.contentVcr?.clear();
    }
  }
  get opened() {
    return this._isOpened;
  }
}
