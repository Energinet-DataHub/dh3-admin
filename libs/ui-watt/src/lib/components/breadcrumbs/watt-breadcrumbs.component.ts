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
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { WattIconModule } from '../../foundations/icon/icon.module';

@Component({
  selector: 'watt-breadcrumb',
  standalone: true,
  imports: [CommonModule, WattIconModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #templateRef>
      <span
        class="watt-breadcrumb"
        (click)="click.emit($event)"
        [class.interactive]="click.observed"
        [attr.role]="click.observed ? 'link' : null"
      >
        <ng-content></ng-content>
      </span>
    </ng-template>
  `,
})
export class WattBreadcrumbComponent {
  @ViewChild('templateRef') templateRef!: TemplateRef<unknown>;

  // Used to determine if the breadcrumb is interactive or not
  @Output() click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>(); // eslint-disable-line @angular-eslint/no-output-native
}

/**
 * Usage:
 * `import { WATT_BREADCRUMBS } from '@energinet-datahub/watt/breadcrumbs';`
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, WattIconModule],
  selector: 'watt-breadcrumbs',
  styleUrls: ['./watt-breadcrumbs.component.scss'],
  template: `
    <nav>
      <ng-container *ngFor="let breadcrumb of breadcrumbs; let isLast = last">
        <ng-container *ngTemplateOutlet="breadcrumb.templateRef"></ng-container>
        <watt-icon *ngIf="!isLast" name="right"></watt-icon>
      </ng-container>
    </nav>
  `,
})
export class WattBreadcrumbsComponent {
  /** @ignore  */
  @ContentChildren(WattBreadcrumbComponent)
  breadcrumbs!: QueryList<WattBreadcrumbComponent>;

  // returns undefined
  // @ContentChildren(WattBreadcrumbComponent, { read: TemplateRef })
  // breadcrumbs!: QueryList<TemplateRef<WattBreadcrumbComponent>>;

  // returns undefined
  // @ContentChildren(TemplateRef)
  // breadcrumbs!: QueryList<TemplateRef<WattBreadcrumbComponent>>;

  // returns undefined
  // @ContentChildren('watt-breadcrumb', { read: TemplateRef })
  // breadcrumbs!: QueryList<TemplateRef<WattBreadcrumbComponent>>;
}

export const WATT_BREADCRUMBS = [
  WattBreadcrumbsComponent,
  WattBreadcrumbComponent,
] as const;
