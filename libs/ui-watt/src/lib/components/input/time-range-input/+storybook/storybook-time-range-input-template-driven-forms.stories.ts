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
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { StorybookConfigurationLocalizationModule } from '../../+storybook/configuration-localization/storybook-configuration-localization.module';

import { WattFormFieldModule } from '../../../form-field/form-field.module';
import { WattTimeRangeInputComponent } from '../watt-time-range-input.component';
import { WattTimeRangeInputModule } from '../watt-time-range-input.module';

export default {
  title: 'Components/Time-range Input/Template-Driven Forms',
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        WattFormFieldModule,
        WattTimeRangeInputModule,
        BrowserAnimationsModule,
        StorybookConfigurationLocalizationModule.forRoot(),
      ],
    }),
  ],
  component: WattTimeRangeInputComponent,
} as Meta<WattTimeRangeInputComponent>;

export const withModel: Story<WattTimeRangeInputComponent> = (args) => ({
  props: {
    ...args,
    timeRangeModel: null,
  },
  template: `
    <watt-form-field>
     <watt-label>Time range</watt-label>
     <watt-time-range-input [(ngModel)]="timeRangeModel"></watt-time-range-input>
    </watt-form-field>

    <p>Selected range: {{ timeRangeModel | json }}</p>`,
});

export const withInitialValue: Story<WattTimeRangeInputComponent> = (args) => ({
  props: {
    ...args,
    timeRangeModel: { start: '00:00', end: '23:59' },
  },
  template: `
    <watt-form-field>
     <watt-label>Time range</watt-label>
     <watt-time-range-input [(ngModel)]="timeRangeModel"></watt-time-range-input>
    </watt-form-field>

    <p>Selected range: {{ timeRangeModel | json }}</p>`,
});
