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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { RxLet } from '@rx-angular/template/let';
import { map, Observable, tap } from 'rxjs';

import {
  DisplayLanguage,
  displayLanguages,
  toDisplayLanguage,
} from '@energinet-datahub/dh/globalization/domain';
import { WattLocaleService } from '@energinet-datahub/watt/locale';

import { DhLanguageButtonComponent } from '../language-button/dh-language-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dh-language-picker',
  templateUrl: './dh-language-picker.component.html',
  styleUrls: ['./dh-language-picker.component.scss'],
  standalone: true,
  imports: [RxLet, DhLanguageButtonComponent],
})
export class DhLanguagePickerComponent {
  private transloco = inject(TranslocoService);
  private localeService = inject(WattLocaleService);
  activeLanguage$: Observable<DisplayLanguage> = this.transloco.langChanges$.pipe(
    map(toDisplayLanguage),
    tap((language) => {
      this.localeService.setActiveLocale(language);
    })
  );
  displayLanguages = displayLanguages;

  onLanguageSelect(language: DisplayLanguage): void {
    this.transloco.setActiveLang(language);
  }
}
