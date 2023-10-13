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
  EventEmitter,
  Input,
  Optional,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { WattResizeObserverDirective } from '../../utils/resize-observer';
import { WattButtonComponent } from '../button';
import { WattSpinnerComponent } from '../spinner';

import { WattModalModule, WattModalService, WattModalSize } from './watt-modal.service';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Component for representing a binary decision in the form of
 * a modal window that appears in front of the entire content.
 *
 * Usage:
 * `import { WATT_MODAL } from '@energinet-datahub/watt/modal';`
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-modal',
  styleUrls: ['./watt-modal.component.scss'],
  templateUrl: './watt-modal.component.html',
  standalone: true,
  imports: [
    CommonModule,
    WattResizeObserverDirective,
    WattButtonComponent,
    WattSpinnerComponent,
    WattModalModule,
  ],
})
export class WattModalComponent {
  /** Title to stay fixed to top of modal. */
  @Input()
  title = '';

  /** Used to adjust modal size to best fit the content. */
  @Input()
  size: WattModalSize = 'normal';

  /** Whether the modal should show a loading state. */
  @Input()
  loading = false;

  /** Whether the modal should show a loading text for the loading state. */
  @Input()
  loadingMessage = '';

  /** Disable ESC, close button and backdrop click as methods of closing. */
  @Input()
  disableClose = false;

  /** The aria-label for the close button. */
  @Input()
  closeLabel = 'Close';

  @Input()
  minHeight = '147px';

  /**
   * When modal is closed, emits `true` if it was "accepted",
   * otherwise emits `false`.
   * @ignore
   */
  @Output()
  closed = new EventEmitter<boolean>();

  /** @ignore */
  @ViewChild('modal')
  modal!: TemplateRef<Element>;

  /** @ignore */
  scrollable = false;

  constructor(
    private modalService: WattModalService,
    @Optional() protected dialogRef: MatDialogRef<unknown>
  ) {}

  /**
   * Opens the modal. Subsequent calls are ignored while the modal is opened.
   * @ignore
   */
  open() {
    this.modalService.open({
      size: this.size,
      disableClose: this.disableClose,
      templateRef: this.modal,
      onClosed: this.closed,
    });
  }

  /**
   * Closes the modal with `true` for acceptance or `false` for rejection.
   * @ignore
   */
  close(result: boolean) {
    this.modalService.close(result); // inline modal
    this.dialogRef?.close(result); // injected modal
  }

  /**
   * Called when the modal content element changes size.
   * @ignore
   */
  onResize(event: ResizeObserverEntry) {
    this.scrollable = event.target.scrollHeight > event.target.clientHeight;
  }
}

/**
 * Component for projecting buttons (actions) to the bottom of the modal.
 */
@Component({
  selector: 'watt-modal-actions',
  template: '<ng-content />',
  standalone: true,
})
export class WattModalActionsComponent {}

export const WATT_MODAL = [WattModalComponent, WattModalActionsComponent];
