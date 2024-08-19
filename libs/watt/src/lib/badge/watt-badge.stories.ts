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
import { Meta, StoryFn } from '@storybook/angular';

import { WattBadgeComponent, WattBadgeSize } from './watt-badge.component';
import { InputSignal } from '@angular/core';

const meta: Meta<WattBadgeComponent> = {
  title: 'Components/Badge',
  component: WattBadgeComponent,
};

export default meta;

const Template: StoryFn<WattBadgeComponent> = (args) => ({
  props: args,
  template: `
    <div style="display: flex; gap: var(--watt-space-m);">
      <watt-badge type="neutral" [size]="size">Neutral</watt-badge>
      <watt-badge type="info" [size]="size">Info</watt-badge>
      <watt-badge type="success" [size]="size">Success</watt-badge>
      <watt-badge type="warning" [size]="size">Warning</watt-badge>
      <watt-badge type="danger" [size]="size">Danger</watt-badge>
    </div>
  `,
});

export const Normal = Template.bind({});
Normal.args = { size: 'normal' as unknown as InputSignal<WattBadgeSize> };

export const Large = Template.bind({});
Large.args = { size: 'large' as unknown as InputSignal<WattBadgeSize> };
