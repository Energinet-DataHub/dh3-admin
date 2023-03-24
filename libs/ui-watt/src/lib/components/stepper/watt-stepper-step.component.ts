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
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatStep } from '@angular/material/stepper';

@Component({
  selector: 'watt-stepper-step',
  template: `<ng-template #templateRef>
    <ng-content></ng-content>
  </ng-template>`,
  standalone: true,
})
export class WattStepperStepComponent extends MatStep {
  @ViewChild('templateRef') public templateRef: TemplateRef<unknown> | null = null;
  @Input() public nextButtonLabel?: string;
  @Input() public previousButtonLabel?: string;
}
