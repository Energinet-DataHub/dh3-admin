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
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { WattIcon, _allIcons, _customIcons } from './icons';

@Injectable({ providedIn: 'root' })
export class WattIconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.addSvgIcon('explore', '/assets/ui-watt/icons/explore.svg');
    this.addSvgIcon('power', '/assets/ui-watt/icons/power.svg');
  }

  isCustomIcon(icon: WattIcon): boolean {
    return Object.values(_customIcons).includes(icon);
  }

  getIconName(icon: WattIcon) {
    return _allIcons[icon];
  }

  private addSvgIcon(icon: WattIcon, url: string) {
    this.iconRegistry.addSvgIcon(
      this.getIconName(icon),
      this.sanitizer.bypassSecurityTrustResourceUrl(url)
    );
  }
}
