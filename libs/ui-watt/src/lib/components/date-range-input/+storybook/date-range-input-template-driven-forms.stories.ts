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

// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { DhConfigurationLocalizationRootModule } from '@energinet-datahub/dh/globalization/configuration-localization';
import { WattDateRangeInputComponent } from '../date-range-input.component';
import { WattDateRangeInputModule } from '../date-range-input.module';

export default {
  title: 'Components/Date Input Range/Template Driven Forms',
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        WattDateRangeInputModule,
        BrowserAnimationsModule,
        DhConfigurationLocalizationRootModule,
      ],
    }),
  ],
  component: WattDateRangeInputComponent,
} as Meta<WattDateRangeInputComponent>;

const template = `
<watt-form-field>
  <watt-label>Date range</watt-label>
  <watt-date-range-input [(ngModel)]="dateRangeModel"></watt-date-range-input>
</watt-form-field>

<p>Selected range: {{dateRangeModel | json}}</p>
`

export const templateDrivenForms: Story<WattDateRangeInputComponent> = (
  args
) => ({
  props: {
    ...args,
    dateRangeModel: {},
  },
  template,
});

templateDrivenForms.parameters = {
  docs: {
    source: {
      code: template,
    },
  },
};

templateDrivenForms.argTypes = {
  min: {
    description:
      'Minimum value. This needs to be in the same format as the `dd-mm-yyyy`',
  },
  max: {
    description:
      'Maximum value. This needs to be in the same format as the `dd-mm-yyyy`',
  },
};
