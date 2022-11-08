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
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
  AfterViewInit,
  Output,
  EventEmitter,
  HostBinding
} from '@angular/core';

import { WattIconModule } from '../../foundations/icon/icon.module';

@Component({
  selector: 'watt-breadcrumb',
  standalone: true,
  imports: [CommonModule, WattIconModule],
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content><watt-icon *ngIf="!isLast" name="right"></watt-icon>`,
})
export class WattBreadcrumbComponent {
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() click: EventEmitter<unknown> = new EventEmitter<unknown>(); // Used to determine if the breadcrumb is interactive or not
  @HostBinding('class.interactive') get isInteractive() {
    return this.click.observed;
  };
  @HostBinding('attr.role') get role() {
    return this.isInteractive ? 'link' : null;
  };
  isLast = false;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, WattIconModule],
  selector: 'watt-breadcrumbs',
  styleUrls: ['./watt-breadcrumbs.component.scss'],
  templateUrl: './watt-breadcrumbs.component.html',
})
export class WattBreadcrumbsComponent implements AfterViewInit {
  @ContentChildren(WattBreadcrumbComponent) breadcrumbs!: QueryList<WattBreadcrumbComponent>;

  ngAfterViewInit() {
    this.breadcrumbs.last.isLast = true;
  }
}
