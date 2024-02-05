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
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@ngneat/transloco';
import { RxPush } from '@rx-angular/template/push';
import { ApolloModule } from 'apollo-angular';

import { WattShellComponent } from '@energinet-datahub/watt/shell';
import { DhProfileAvatarComponent } from '@energinet-datahub/dh/profile/feature-avatar';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { DhLanguagePickerComponent } from '@energinet-datahub/dh/globalization/feature-language-picker';
import { DhTopBarStore } from '@energinet-datahub/dh-shared-data-access-top-bar';
import {
  DhInactivityDetectionService,
  DhSelectedActorComponent,
  DhSignupMitIdComponent,
} from '@energinet-datahub/dh/shared/feature-authorization';

import { DhPrimaryNavigationComponent } from './dh-primary-navigation.component';

@Component({
  selector: 'dh-shell',
  styleUrls: ['./dh-core-shell.component.scss'],
  templateUrl: './dh-core-shell.component.html',
  standalone: true,
  imports: [
    TranslocoDirective,
    TranslocoPipe,
    ApolloModule,
    RouterOutlet,
    RxPush,

    DhLanguagePickerComponent,
    DhProfileAvatarComponent,
    DhPrimaryNavigationComponent,
    WattShellComponent,
    WattButtonComponent,
    DhSelectedActorComponent,
    DhSignupMitIdComponent,
  ],
})
export class DhCoreShellComponent {
  private readonly dhTopBarStore = inject(DhTopBarStore);
  titleTranslationKey$ = this.dhTopBarStore.titleTranslationKey$;

  constructor(inactivityDetection: DhInactivityDetectionService) {
    inactivityDetection.trackInactivity();
  }
}
