import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';

import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  WattFieldComponent,
  WattFieldErrorComponent,
  WattFieldHintComponent,
} from '@energinet-datahub/watt/field';

import { WattPhoneFieldComponent } from '../watt-phone-field.component';

const meta: Meta<WattPhoneFieldComponent> = {
  title: 'Components/Phone Field',
  component: WattPhoneFieldComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        WattFieldComponent,
        WattFieldErrorComponent,
        WattFieldHintComponent,
      ],
    }),
    applicationConfig({
      providers: [provideAnimations(), importProvidersFrom(HttpClientModule)],
    }),
  ],
};

export default meta;

export const Default: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Phone number',
    exampleFormControl: new FormControl(null),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl" />`,
});

export const WithRequired: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Required Phone number',
    exampleFormControl: new FormControl(null, Validators.required),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl" />`,
});

export const WithValue: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'With Phone number',
    exampleFormControl: new FormControl('+49 25242322'),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl" />`,
});

export const WithHint: StoryFn<WattPhoneFieldComponent> = () => ({
  props: {
    label: 'Phone number with hint',
    exampleFormControl: new FormControl(null, Validators.required),
  },
  template: `<watt-phone-field [label]="label" [formControl]="exampleFormControl">
              <watt-field-hint>This is a hint</watt-field-hint>
            </watt-phone-field>`,
});
