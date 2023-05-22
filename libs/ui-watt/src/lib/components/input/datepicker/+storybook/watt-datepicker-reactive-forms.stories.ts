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

import { StorybookConfigurationLocalizationModule } from '../../+storybook/storybook-configuration-localization.module';
import { WattDatepickerComponent } from '../watt-datepicker.component';
import { WattDatepickerModule } from '../watt-datepicker.module';
import { WattFormFieldModule } from '../../../form-field/form-field.module';
import { WattRangeValidators } from '../../shared/validators';
import { importProvidersFrom } from '@angular/core';

export const initialValueSingle = '2022-09-02T22:00:00.000Z';
export const initialValueRangeStart = initialValueSingle;
export const initialValueRangeEnd_StartOfDay = '2022-09-14T22:00:00.000Z';
export const initialValueRangeEnd_EndOfDay = '2022-09-15T21:59:59.999Z';

export interface WattDatepickerStoryConfig extends WattDatepickerComponent {
  disableAnimations?: boolean; // Used to disable animations for the tests
}

export default {
  title: 'Components/Datepicker',
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        importProvidersFrom(StorybookConfigurationLocalizationModule.forRoot()),
      ],
    }),
    moduleMetadata({
      imports: [ReactiveFormsModule, WattFormFieldModule, WattDatepickerModule],
    }),
  ],
  component: WattDatepickerComponent,
  excludeStories: [
    'initialValueSingle',
    'initialValueRangeStart',
    'initialValueRangeEnd_StartOfDay',
    'initialValueRangeEnd_EndOfDay',
  ],
} as Meta;

const template = `
<watt-form-field>
  <watt-label>Single date</watt-label>
  <watt-datepicker [formControl]="exampleFormControlSingle"></watt-datepicker>
  <watt-error *ngIf="exampleFormControlSingle?.errors?.required">
      Date is required
  </watt-error>
</watt-form-field>

<p>Value: <code>{{ exampleFormControlSingle.value | json }}</code></p>
<p *ngIf="withValidations">Errors: <code>{{ exampleFormControlSingle?.errors | json }}</code></p>

<br />

<watt-form-field>
  <watt-label>Date range</watt-label>
  <watt-datepicker [formControl]="exampleFormControlRange" [range]="true"></watt-datepicker>
  <watt-error *ngIf="exampleFormControlRange?.errors?.rangeRequired">
      Date range is required
  </watt-error>
</watt-form-field>

<p>Selected range: <code data-testid="rangeValue">{{ exampleFormControlRange.value | json }}</code></p>
<p *ngIf="withValidations">Errors: <code>{{ exampleFormControlRange?.errors | json }}</code></p>
`;

export const WithFormControl: StoryFn<WattDatepickerStoryConfig> = (args) => ({
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

export const WithInitialValue: StoryFn<WattDatepickerStoryConfig> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl(initialValueSingle),
    exampleFormControlRange: new FormControl({
      start: initialValueRangeStart,
      end: initialValueRangeEnd_StartOfDay,
    }),
    ...args,
  },
  template,
});

export const WithValidations: StoryFn<WattDatepickerStoryConfig> = (args) => ({
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
  const dateInput: HTMLInputElement = canvas.getByRole('textbox', {
    name: /^date-input/i,
  });
  const startDateInput: HTMLInputElement = canvas.getByRole('textbox', {
    name: /start-date-input/i,
  });
  fireEvent.focusOut(dateInput);
  fireEvent.focusOut(startDateInput);
};

export const WithFormControlDisabled: StoryFn<WattDatepickerStoryConfig> = (args) => ({
  props: {
    exampleFormControlSingle: new FormControl({ value: null, disabled: true }),
    exampleFormControlRange: new FormControl({ value: null, disabled: true }),
    ...args,
  },
  template,
});
