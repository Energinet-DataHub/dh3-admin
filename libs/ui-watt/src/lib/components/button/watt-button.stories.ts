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

import { StorybookButtonOverviewModule } from './+storybook/storybook-button-overview.module';
import { WattButtonComponent } from './watt-button.component';
import { WattButtonModule } from './watt-button.module';

export default {
  title: 'Components/Button',
  component: WattButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [WattButtonModule],
    }),
  ],
} as Meta<WattButtonComponent>;

const howToUseGuide = `
1. Import ${WattButtonModule.name} in a module
import { ${WattButtonModule.name} } from '@energinet-datahub/watt';

2. Use <watt-button>Button</watt-button> in the component's HTML template
`;

export const Overview = () => ({
  template: '<storybook-button-overview></storybook-button-overview>',
});
Overview.decorators = [
  moduleMetadata({
    imports: [StorybookButtonOverviewModule],
  }),
];
Overview.parameters = {
  docs: {
    source: {
      code: howToUseGuide,
    },
  },
};

//👇 We create a “template” of how args map to rendering
const ButtonTemplate: Story<WattButtonComponent> = (args) => ({
  props: args,
  template: `
<watt-button
  type="${args.type}"
  icon="${args.icon}"
  size="${args.size}"
  [loading]="${args.loading}"
  [disabled]="${args.disabled}">
  Button
</watt-button>`,
});

export const PrimaryButton = ButtonTemplate.bind({});
PrimaryButton.storyName = 'Primary';
PrimaryButton.args = {
  type: 'primary',
};

export const PrimaryButtonWithIcon = ButtonTemplate.bind({});
PrimaryButtonWithIcon.storyName = 'Primary with icon';
PrimaryButtonWithIcon.args = {
  icon: 'plus',
  type: 'primary',
};

export const PrimaryButtonLoading = ButtonTemplate.bind({});
PrimaryButtonLoading.storyName = 'Primary in loading state';
PrimaryButtonLoading.args = {
  type: 'primary',
  loading: true,
};

export const SecondaryButton = ButtonTemplate.bind({});
SecondaryButton.storyName = 'Secondary';
SecondaryButton.args = {
  type: 'secondary',
};

export const SecondaryButtonWithIcon = ButtonTemplate.bind({});
SecondaryButtonWithIcon.storyName = 'Secondary with icon';
SecondaryButtonWithIcon.args = {
  icon: 'plus',
  type: 'secondary',
};

export const SecondaryButtonLoading = ButtonTemplate.bind({});
SecondaryButtonLoading.storyName = 'Secondary in loading state';
SecondaryButtonLoading.args = {
  type: 'secondary',
  loading: true,
};

export const TextButton = ButtonTemplate.bind({});
TextButton.storyName = 'Text';
TextButton.args = {
  type: 'text',
};

export const TextButtonWithIcon = ButtonTemplate.bind({});
TextButtonWithIcon.storyName = 'Text with icon';
TextButtonWithIcon.args = {
  icon: 'plus',
  type: 'text',
};

export const TextButtonLoading = ButtonTemplate.bind({});
TextButtonLoading.storyName = 'Text in loading state';
TextButtonLoading.args = {
  type: 'text',
  loading: true,
};

export const ButtonSizeNormal = ButtonTemplate.bind({});
ButtonSizeNormal.storyName = 'Normal size';
ButtonSizeNormal.args = {
  type: 'primary',
};

export const ButtonSizeLarge = ButtonTemplate.bind({});
ButtonSizeLarge.storyName = 'Large size';
ButtonSizeLarge.args = {
  type: 'primary',
  size: 'large',
};
