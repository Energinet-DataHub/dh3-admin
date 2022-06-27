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
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WattButtonModule } from '../button';
import { WattModalModule } from './watt-modal.module';
import { WattModalComponent } from './watt-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Components/Modal',
  component: WattModalComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, WattButtonModule, WattModalModule],
    }),
  ],
} as Meta<WattModalComponent>;

export const Overview: Story<WattModalComponent> = (args) => ({
  props: args,
  template: `
    <watt-button (click)="modal.open()">Open Modal</watt-button>
    <watt-modal #modal [size]="size" [title]="title">
      <h3>Develop across all platforms</h3>
      <p>Learn one way to build applications with Angular and reuse your code and abilities to build apps for any deployment target. For web, mobile web, native mobile and native desktop.</p>
      <h3>Speed &amp; Performance</h3>
      <p>Achieve the maximum speed possible on the Web Platform today, and take it further, via Web Workers and server-side rendering. Angular puts you in control over scalability. Meet huge data requirements by building data models on RxJS, Immutable.js or another push-model.</p>
      <h3>Incredible tooling</h3>
      <p>Build features quickly with simple, declarative templates. Extend the template language with your own components and use a wide array of existing components. Get immediate Angular-specific help and feedback with nearly every IDE and editor. All this comes together so you can focus on building amazing apps rather than trying to make the code work.</p>
      <h3>Loved by millions</h3>
      <p>From prototype through global deployment, Angular delivers the productivity and scalable infrastructure that supports Google's largest applications.</p>
      <h3>What is Angular?</h3>
      <p>Angular is a platform that makes it easy to build applications with the web. Angular combines declarative templates, dependency injection, end to end tooling, and integrated best practices to solve development challenges. Angular empowers developers to build applications that live on the web, mobile, or the desktop</p>
      <h3>Architecture overview</h3>
      <p>Angular is a platform and framework for building client applications in HTML and TypeScript. Angular is itself written in TypeScript. It implements core and optional functionality as a set of TypeScript libraries that you import into your apps.</p>
      <p>The basic building blocks of an Angular application are NgModules, which provide a compilation context for components. NgModules collect related code into functional sets; an Angular app is defined by a set of NgModules. An app always has at least a root module that enables bootstrapping, and typically has many more feature modules.</p>
      <p>Components define views, which are sets of screen elements that Angular can choose among and modify according to your program logic and data. Every app has at least a root component.</p>
      <p>Components use services, which provide specific functionality not directly related to views. Service providers can be injected into components as dependencies, making your code modular, reusable, and efficient.</p>
      <p>Both components and services are simply classes, with decorators that mark their type and provide metadata that tells Angular how to use them.</p>
      <p>The metadata for a component class associates it with a template that defines a view. A template combines ordinary HTML with Angular directives and binding markup that allow Angular to modify the HTML before rendering it for display.</p>
      <p>The metadata for a service class provides the information Angular needs to make it available to components through Dependency Injection (DI).</p>
      <p>An app's components typically define many views, arranged hierarchically. Angular provides the Router service to help you define navigation paths among views. The router provides sophisticated in-browser navigational capabilities.</p>
      <watt-modal-actions>
        <watt-button variant="secondary" (click)="modal.close(false)">Reject</watt-button>
        <watt-button (click)="modal.close(true)">Accept</watt-button>
      </watt-modal-actions>
    </watt-modal>
  `,
});

Overview.args = {
  title: 'Install Angular',
  size: 'large',
};
