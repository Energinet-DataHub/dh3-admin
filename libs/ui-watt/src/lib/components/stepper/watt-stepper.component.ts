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
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { WattStepperStepComponent } from './watt-stepper-step.component';
import { WattIconComponent } from '../../foundations/icon/icon.component';
import { CommonModule } from '@angular/common';
import { CdkStepper, StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { PushModule } from '@rx-angular/template/push';
import { from, map, Observable, of, startWith, withLatestFrom } from 'rxjs';
import { WattButtonModule } from '../button';

@Component({
  selector: 'watt-stepper',
  standalone: true,
  templateUrl: './watt-stepper.component.html',
  styleUrls: ['./watt-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    WattStepperStepComponent,
    MatStepperModule,
    CommonModule,
    WattIconComponent,
    WattButtonModule,
    PushModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true, displayDefaultIndicatorType: false },
    },
    { provide: CdkStepper, useExisting: WattStepperComponent },
    { provide: MatStepper, useExisting: WattStepperComponent },
  ],
})
export class WattStepperComponent extends MatStepper implements AfterViewInit {
  @Output() completed = new EventEmitter<void>();

  @ContentChildren(WattStepperStepComponent, { descendants: true })
  override _steps!: QueryList<WattStepperStepComponent>;

  override readonly steps!: QueryList<WattStepperStepComponent>;

  @ViewChild(MatStepper) stepper!: MatStepper;

  selectedIndexChanged$!: Observable<StepperSelectionEvent>;
  onFirstStep$!: Observable<boolean>;
  onLastStep$!: Observable<boolean>;

  override ngAfterViewInit(): void {
    this.selectedIndexChanged$ = from(this.stepper.selectionChange);
    this.onLastStep$ = this.selectedIndexChanged$.pipe(
      withLatestFrom(of(this.steps)),
      map(([index, steps]) => index.selectedIndex === steps.length - 1),
      startWith(false)
    );
    this.onFirstStep$ = this.selectedIndexChanged$.pipe(
      map((index) => index.selectedIndex > 0),
      startWith(false)
    );
  }

  nextStep(): void {
    this.stepper.selected?.stepControl.markAllAsTouched();
    this.stepper.next();
  }

  previousStep(): void {
    this.stepper.previous();
  }

  complete(): void {
    this.stepper.selected?.stepControl.markAllAsTouched();
    this.completed.emit();
  }
}

export const WATT_STEPPER = [WattStepperComponent, WattStepperStepComponent];
