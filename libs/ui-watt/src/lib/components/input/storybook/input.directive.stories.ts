/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { InputComponent } from './input.component';
import { InputStoriesModule } from './input.stories.module';

export default {
  title: 'Components/Text Field',
  component: InputComponent,
  decorators: [
    moduleMetadata({
      imports: [InputStoriesModule],
    }),
  ],
} as Meta<InputComponent>;

const Template: Story<InputComponent> = (args) => ({
  props: args,
});

const overviewTemplate: Story = () => ({
  template: `<watt-input-overview></watt-input-overview>`,
});
export const overview = overviewTemplate.bind({});
overview.parameters = {
  docs: {
    source: {
      code: 'Nothing to see here.',
    },
  },
};

export const disabled = Template.bind({});
disabled.args = {
  disabled: true,
};
disabled.parameters = {
  docs: {
    source: {
      code: `// HTML:
<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" />
</watt-form-field>

// TypeScript (should be done via ReactiveForms and not by attribute):
exampleFormControl = new FormControl({value: '', disabled: true});`,
    },
  },
};

export const sizeLarge = Template.bind({});
sizeLarge.args = {
  size: 'large',
};
sizeLarge.parameters = {
  docs: {
    source: {
      code: `<watt-form-field size="large">
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" />
</watt-form-field>`,
    },
  },
};

export const leadingIcon = Template.bind({});
leadingIcon.args = {
  hasPrefix: true,
};
leadingIcon.parameters = {
  docs: {
    source: {
      code: `<watt-form-field>
  <watt-label>label</watt-label>
  <button wattPrefix aria-label="some meaningful description">
    icon
  </button>
  <input wattInput />
</watt-form-field>`,
    },
  },
};

export const trailingIcon = Template.bind({});
trailingIcon.args = {
  hasSuffix: true,
};
trailingIcon.parameters = {
  docs: {
    source: {
      code: `<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput />
  <button wattSuffix aria-label="some meaningful description">
    icon
  </button>
</watt-form-field>`,
    },
  },
};

export const assistiveText = Template.bind({});
assistiveText.args = {
  hasHint: true,
};
assistiveText.parameters = {
  docs: {
    source: {
      code: `HTML:
<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" />
  <watt-hint>Some hint</watt-hint>
  <watt-hint align="end">{{exampleFormControl.value.length}} / 256</watt-hint>
</watt-form-field>

TypeScript:
exampleFormControl = new FormControl('');
`,
    },
  },
};

export const error = Template.bind({});
error.args = {
  hasError: true,
};
error.parameters = {
  docs: {
    source: {
      code: `HTML:
<watt-form-field>
  <watt-label>label</watt-label>
  <input wattInput [formControl]="exampleFormControl" required />
  <watt-error *ngIf="exampleFormControl.hasError('required')">
    This field is required
  </watt-error>
</watt-form-field>

TypeScript:
exampleFormControl = new FormControl('', [
  Validators.required
]);
`,
    },
  },
};
