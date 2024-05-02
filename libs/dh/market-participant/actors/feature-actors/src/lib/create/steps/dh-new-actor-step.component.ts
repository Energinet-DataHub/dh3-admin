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

import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input, signal } from '@angular/core';
import { TranslocoDirective } from '@ngneat/transloco';

import { EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattFieldErrorComponent, WattFieldHintComponent } from '@energinet-datahub/watt/field';

import { ActorForm } from '../dh-actor-form.model';
import { getGridAreaOptions } from '@energinet-datahub/dh/shared/data-access-graphql';
import { RxPush } from '@rx-angular/template/push';

@Component({
  standalone: true,
  selector: 'dh-new-actor-step',
  imports: [
    VaterStackComponent,
    TranslocoDirective,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattFieldHintComponent,
    WattDropdownComponent,
    WattPhoneFieldComponent,
    ReactiveFormsModule,
    DhDropdownTranslatorDirective,
    RxPush,
  ],
  styles: [
    `
      :host {
        display: block;
      }

      watt-dropdown {
        width: 100%;
      }

      h4 {
        margin-top: 0;
      }
    `,
  ],
  template: `<vater-stack
    gap="xl"
    align="flex-start"
    direction="row"
    *transloco="let t; read: 'marketParticipant.actor.create'"
  >
    <vater-stack fill="horizontal" align="flex-start" direction="column">
      <h4>{{ t('marketParty') }}</h4>

      <watt-text-field
        [formControl]="newActorForm.controls.glnOrEicNumber"
        [label]="t('glnOrEicNumber')"
      >
        <watt-field-hint>{{ t('glnOrEicHint') }}</watt-field-hint>
        @if (newActorForm.controls.glnOrEicNumber.hasError('invalidGlnOrEic')) {
          <watt-field-error>
            {{ t('glnOrEicInvalid') }}
          </watt-field-error>
        }
      </watt-text-field>

      <watt-text-field [formControl]="newActorForm.controls.name" [label]="t('name')" />
      <watt-dropdown
        translate="marketParticipant.marketRoles"
        dhDropdownTranslator
        [options]="marketRoleOptions"
        [showResetOption]="false"
        (ngModelChange)="onMarketRoleChange($event)"
        [formControl]="newActorForm.controls.marketrole"
        [label]="t('marketRole')"
      />

      @if (showGridAreaOptions()) {
        <watt-dropdown
          [options]="gridAreaOptions | push"
          [multiple]="true"
          [formControl]="newActorForm.controls.gridArea"
          [label]="t('gridArea')"
        />
      }
    </vater-stack>
    <vater-stack fill="horizontal" align="flex-start" direction="column">
      <h4>{{ t('contact') }}</h4>
      <watt-text-field
        [formControl]="newActorForm.controls.contact.controls.departmentOrName"
        [label]="t('departmentOrName')"
      />
      <watt-text-field
        [formControl]="newActorForm.controls.contact.controls.email"
        [label]="t('email')"
      >
        @if (newActorForm.controls.contact.controls.email.hasError('pattern')) {
          <watt-field-error>
            {{ t('wrongEmailPattern') }}
          </watt-field-error>
        }
      </watt-text-field>
      <watt-phone-field
        [formControl]="newActorForm.controls.contact.controls.phone"
        [label]="t('phone')"
      />
    </vater-stack>
  </vater-stack>`,
})
export class DhNewActorStepComponent {
  @Input({ required: true }) newActorForm!: ActorForm;

  marketRoleOptions: WattDropdownOptions = dhEnumToWattDropdownOptions(EicFunction);
  gridAreaOptions = getGridAreaOptions();

  showGridAreaOptions = signal(false);

  onMarketRoleChange(eicfunction: EicFunction): void {
    this.showGridAreaOptions.set(eicfunction === EicFunction.GridAccessProvider);

    if (eicfunction === EicFunction.GridAccessProvider) {
      this.newActorForm.controls.gridArea.enable();
    }
  }
}
