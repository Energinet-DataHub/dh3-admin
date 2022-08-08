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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { fireEvent, within } from '@storybook/testing-library';

import { WattButtonModule } from '../../button';
import { WattDrawerComponent } from '../watt-drawer.component';
import { WattDrawerModule } from '../watt-drawer.module';
import { WattStorybookDrawerContentModule } from './storybook-drawer-content.component';

export default {
  title: 'Components/Drawer',
  component: WattDrawerComponent,
  argTypes: {
    size: { control: false },
    opened: { control: false },
    closed: {
      table: { category: 'Outputs' },
      control: false,
    },
    close: {
      table: { category: 'Methods' },
      control: false,
    },
    open: {
      table: { category: 'Methods' },
      control: false,
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        WattDrawerModule,
        BrowserAnimationsModule,
        WattButtonModule,
        WattStorybookDrawerContentModule,
      ],
    }),
  ],
} as Meta;

const template = `
<!-- Notice: the #drawer reference, to access the instance of the drawer -->
<watt-drawer #drawer (closed)="closed()" [size]="size">
  <watt-drawer-topbar>
    <span>Top bar</span>
  </watt-drawer-topbar>

  <watt-drawer-actions>
    <watt-button variant="secondary">Secondary action</watt-button>
    <watt-button>Primary action</watt-button>
  </watt-drawer-actions>

  <!--
    *ngIf ensures the content are not loaded before the drawer is open,
    and make sure it's getting destroyed when drawer is closed
  -->
  <watt-drawer-content *ngIf="drawer.opened">
    <watt-storybook-drawer-content></watt-storybook-drawer-content>
  </watt-drawer-content>
</watt-drawer>

<watt-button (click)="drawer.open()">Open drawer</watt-button><br /><br />
<watt-button (click)="drawer.close()">Close drawer from outside of the drawer</watt-button>
`;

const Drawer: Story<WattDrawerComponent> = (args) => ({
  props: args,
  template,
});

Drawer.parameters = {
  docs: {
    source: {
      code: template
        .replace('<span>Top bar</span>', '<!-- Top bar content -->')
        .replace(
          '<watt-storybook-drawer-content></watt-storybook-drawer-content>',
          '<!-- Main content -->'
        )
        .replace(/<br \/>/g, ''),
    },
  },
};

Drawer.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const openDrawerButton: HTMLInputElement = canvas.getByRole('button', {
    name: /^open drawer/i,
  });
  fireEvent.click(openDrawerButton);
};

export const Small = Drawer.bind({});
Small.args = { size: 'small' };

export const Normal = Drawer.bind({});
Normal.args = { size: 'normal' };

export const Large = Drawer.bind({});
Large.args = { size: 'large' };

export const Multiple: Story<WattDrawerComponent> = (args) => ({
  props: args,
  template: `
    <watt-drawer #first (closed)="closed()">
      <watt-drawer-content *ngIf="first.opened">
        First drawer
      </watt-drawer-content>
    </watt-drawer>

    <watt-drawer #second (closed)="closed()">
      <watt-drawer-content *ngIf="second.opened">
        Second drawer
      </watt-drawer-content>
    </watt-drawer>

    <watt-button (click)="first.open()">Open first</watt-button><br /><br />
    <watt-button (click)="second.open()">Open second</watt-button>
  `,
});
