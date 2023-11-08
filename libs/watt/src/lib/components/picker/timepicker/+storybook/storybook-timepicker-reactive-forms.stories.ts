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
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { within, fireEvent } from '@storybook/testing-library';

import { localizationProviders } from '../../shared/+storybook/storybook-configuration-localization.providers';
import { WattRangeValidators } from '../../shared/validators';
import { WattTimepickerComponent } from '../watt-timepicker.component';
import { WattFieldErrorComponent } from '../../../field/watt-field-error.component';
import { WattTimepickerV2Component } from '../watt-timepicker-v2.component';

export default {
  title: 'Components/Timepicker',
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), localizationProviders],
    }),
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattTimepickerV2Component,
        WattTimepickerComponent,
        WattFieldErrorComponent
      ],
    }),
  ],
  component: WattTimepickerComponent,
} as Meta;

const template = `
  <watt-timepicker-v2 label="Single time" [formControl]="exampleFormControlSingle">
    <watt-field-error *ngIf="exampleFormControlSingle?.errors?.required">
      Time is required
    </watt-field-error>
  </watt-timepicker-v2>

 <p>Value: <code>{{exampleFormControlSingle.value | json}}</code></p>
 <p *ngIf="withValidations">Errors: <code>{{exampleFormControlSingle?.errors | json}}</code></p>

 <br />

  <watt-timepicker-v2 label="Time range" sliderLabel="Adjust time range" [formControl]="exampleFormControlRange" [range]="true">
    <watt-field-error *ngIf="exampleFormControlRange?.errors?.rangeRequired">
      Time range is required
    </watt-field-error>
  </watt-timepicker-v2>

  <p>Selected range: <code>{{exampleFormControlRange.value | json}}</code></p>
  <p *ngIf="withValidations">Errors: <code>{{exampleFormControlRange?.errors | json}}</code></p>
 `;

const initialValue = '00:00';

export const WithFormControl: StoryFn<WattTimepickerComponent> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(null),
    exampleFormControlRange: new FormControl(null),
    ...args,
  },
  template,
});

WithFormControl.parameters = {
  docs: {
    source: {
      code: `
 HTML
 ${template}
 TypeScript
 exampleFormControl = new FormControl();
       `,
    },
  },
};

export const WithInitialValue: StoryFn<WattTimepickerComponent> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(initialValue),
    exampleFormControlRange: new FormControl({
      start: initialValue,
      end: '23:59',
    }),
    ...args,
  },
  template,
});

export const WithValidations: StoryFn<WattTimepickerComponent> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(null, [Validators.required]),
    exampleFormControlRange: new FormControl(null, [WattRangeValidators.required()]),
    withValidations: true,
    ...args,
  },
  template,
});

WithValidations.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const timeInput: HTMLInputElement = canvas.getByRole('textbox', {
    name: /^time-input/i,
  });
  const startTimeInput: HTMLInputElement = canvas.getByRole('textbox', {
    name: /start-time-input/i,
  });
  fireEvent.focusOut(timeInput);
  fireEvent.focusOut(startTimeInput);
};

export const WithFormControlDisabled: StoryFn<WattTimepickerComponent> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl({ value: null, disabled: true }),
    exampleFormControlRange: new FormControl({ value: null, disabled: true }),
    ...args,
  },
  template,
});
