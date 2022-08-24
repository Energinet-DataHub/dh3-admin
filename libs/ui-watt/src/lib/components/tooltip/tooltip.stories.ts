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
import { MatTooltipModule } from '@angular/material/tooltip';
import { moduleMetadata, Story } from '@storybook/angular';
import { WattButtonModule } from '../button';

export default {
  title: 'Components/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [WattButtonModule, MatTooltipModule],
    }),
  ],
};

export const Overview: Story = (args) => ({
  props: args,
  template: `
    <watt-button
      matTooltip="Click me"
      matTooltipPosition="below"
    >Button</watt-button>
  `,
});
