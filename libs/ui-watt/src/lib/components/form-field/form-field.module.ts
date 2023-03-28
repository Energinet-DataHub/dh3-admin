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
import { NgModule } from '@angular/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { WattErrorComponent } from './components/error.component';
import { WattHintComponent } from './components/hint.component';
import { WattLabelComponent } from './components/label.component';
import { FormFieldComponent } from './form-field.component';

@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatInputModule],
  declarations: [FormFieldComponent, WattErrorComponent, WattLabelComponent, WattHintComponent],
  exports: [FormFieldComponent, WattErrorComponent, WattLabelComponent, WattHintComponent],
})
export class WattFormFieldModule {}
