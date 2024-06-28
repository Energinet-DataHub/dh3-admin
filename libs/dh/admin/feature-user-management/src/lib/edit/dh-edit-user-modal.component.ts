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
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { HttpStatusCode } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { RxPush } from '@rx-angular/template/push';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { DhUserRolesComponent } from '@energinet-datahub/dh/admin/feature-user-roles';
import {
  UpdateUserRoles,
  DhAdminEditUserStore,
  UserOverviewItem,
} from '@energinet-datahub/dh/admin/data-access-api';
import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';

@Component({
  selector: 'dh-edit-user-modal',
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,
    RxPush,

    WATT_MODAL,
    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattFieldErrorComponent,
    WattTextFieldComponent,
    WattPhoneFieldComponent,

    DhUserRolesComponent,
  ],
  templateUrl: './dh-edit-user-modal.component.html',
  styles: [
    `
      .name-field {
        max-width: 384px;
        margin-right: var(--watt-space-ml);
      }

      .phone-field {
        max-width: 256px;
      }

      .reinvite-link {
        margin-right: auto;
      }
    `,
  ],
  providers: [DhAdminEditUserStore],
})
export class DhEditUserModalComponent implements AfterViewInit, OnChanges {
  private readonly editUserStore = inject(DhAdminEditUserStore);
  private readonly formBuilder = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(WattToastService);

  private _updateUserRoles: UpdateUserRoles | null = null;

  updatedPhoneNumber: string | null = null;

  userInfoForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: ['', Validators.required],
  });

  @ViewChild('editUserModal') editUserModal!: WattModalComponent;
  @ViewChild('userRoles') userRoles!: DhUserRolesComponent;

  @Output() closed = new EventEmitter<void>();
  @Input() user: UserOverviewItem | null = null;

  isSaving$ = this.editUserStore.isSaving$;

  get firstNameControl() {
    return this.userInfoForm.controls.firstName;
  }

  get lastNameControl() {
    return this.userInfoForm.controls.lastName;
  }

  get phoneNumberControl() {
    return this.userInfoForm.controls.phoneNumber;
  }

  ngAfterViewInit(): void {
    this.editUserModal.open();
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.user) {
      this.userInfoForm.patchValue({
        firstName: this.user?.firstName ?? '',
        lastName: this.user?.lastName ?? '',
        phoneNumber: this.user?.phoneNumber ?? '',
      });
    }
  }

  save() {
    if (
      this.user === null ||
      this.userInfoForm.invalid ||
      this._updateUserRoles?.actors.some((actor) => !actor.atLeastOneRoleIsAssigned)
    ) {
      return;
    }

    if (this.userInfoForm.pristine) {
      return this.closeModal(false);
    }

    if (
      this.firstNameControl.value === this.user.firstName &&
      this.lastNameControl.value === this.user.lastName &&
      this.phoneNumberControl.value === this.user.phoneNumber &&
      this._updateUserRoles === null
    ) {
      return this.closeModal(false);
    }

    this.startEditUserRequest(
      this.firstNameControl.value,
      this.lastNameControl.value,
      this.phoneNumberControl.value,
      this._updateUserRoles ?? undefined
    );
  }

  closeModal(status: boolean): void {
    this.userRoles.resetUpdateUserRoles();
    this.editUserModal.close(status);
    this.closed.emit();
  }

  close(): void {
    this.closeModal(false);
  }

  onSelectedUserRolesChanged(updateUserRoles: UpdateUserRoles): void {
    this._updateUserRoles = updateUserRoles;
    this.userInfoForm.markAsDirty();
  }

  private startEditUserRequest(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    updateUserRoles: UpdateUserRoles | undefined
  ) {
    const onSuccessFn = () => {
      this.updateModel(firstName, lastName, phoneNumber);

      this.toastService.open({
        type: 'success',
        message: this.transloco.translate('admin.userManagement.editUser.saveSuccess'),
      });

      this.userRoles.resetUpdateUserRoles();
      this.closeModal(true);
    };

    const onErrorFn = (statusCode: HttpStatusCode, apiErrorCollection: ApiErrorCollection) => {
      if (statusCode !== HttpStatusCode.BadRequest) {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate('admin.userManagement.editUser.saveError'),
        });
      }

      if (statusCode === HttpStatusCode.BadRequest) {
        const message =
          apiErrorCollection.apiErrors.length > 0
            ? readApiErrorResponse([apiErrorCollection])
            : this.transloco.translate('admin.userManagement.editUser.saveError');

        this.toastService.open({ type: 'danger', message, duration: 60_000 });
      }
    };

    const phoneParts = phoneNumber.split(' ');
    const [prefix, ...rest] = phoneParts;
    const formattedPhoneNumber = `${prefix} ${rest.join('')}`;

    if (this.user) {
      this.editUserStore.editUser({
        userId: this.user.id,
        firstName,
        lastName,
        phoneNumber: formattedPhoneNumber,
        updateUserRoles,
        onSuccessFn,
        onErrorFn,
      });
    }
  }

  private updateModel(firstName: string, lastName: string, phoneNumber: string) {
    if (!this.user) return;
    try {
      Object.assign(this.user, { firstName, lastName, phoneNumber });
    } catch (error) {
      // Suppress error
    }
  }
}
