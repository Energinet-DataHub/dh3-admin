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
import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'watt-storybook-drawer-content',
  template: `
    <p>Drawer has been opened for: {{ timer$ | async }}s</p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla assumenda
      perspiciatis officia quam recusandae, voluptate ratione pariatur
      temporibus, consequuntur deserunt numquam dolorum! Sequi assumenda amet,
      laboriosam omnis ex sapiente voluptatibus?
    </p>
  `,
})
export class WattStorybookDrawerContentComponent {
  timer$ = timer(0, 1000);
}

@NgModule({
  declarations: [WattStorybookDrawerContentComponent],
  exports: [WattStorybookDrawerContentComponent],
  imports: [CommonModule],
})
export class WattStorybookDrawerContentModule {}
