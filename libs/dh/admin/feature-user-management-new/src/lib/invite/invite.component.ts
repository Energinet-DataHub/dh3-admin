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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';

import { of } from 'rxjs';
import { translate, TranslocoDirective, TranslocoService } from '@ngneat/transloco';

import { WATT_STEPPER } from '@energinet-datahub/watt/stepper';
import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattIconComponent } from '@energinet-datahub/watt/icon';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattPhoneFieldComponent } from '@energinet-datahub/watt/phone-field';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattValidationMessageComponent } from '@energinet-datahub/watt/validation-message';

import { lazyQuery, mutation, query } from '@energinet-datahub/dh/shared/util-apollo';
import { UserRoleItem } from '@energinet-datahub/dh/admin/data-access-api';

import {
  GetKnownEmailsDocument,
  GetFilteredActorsDocument,
  GetAssociatedActorsDocument,
  InviteUserDocument,
  UserOverviewSearchDocument,
  CheckDomainExistsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';

import {
  ApiErrorCollection,
  readApiErrorResponse,
} from '@energinet-datahub/dh/market-participant/data-access-api';

import { DhAssignableUserRolesComponent } from './assignable-user-roles/assignable-user-roles.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'dh-invite-user',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  standalone: true,
  imports: [
    TranslocoDirective,
    ReactiveFormsModule,

    WATT_MODAL,
    WATT_STEPPER,
    WattIconComponent,
    WattDropdownComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WattPhoneFieldComponent,
    WattValidationMessageComponent,

    DhAssignableUserRolesComponent,
  ],
})
export class DhInviteUserComponent {
  private readonly toastService = inject(WattToastService);
  private readonly changeDectorRef = inject(ChangeDetectorRef);
  private readonly translocoService = inject(TranslocoService);
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);

  inviteUserModal = viewChild.required(WattModalComponent);
  closed = output<void>();

  inviteUserMutation = mutation(InviteUserDocument, {
    refetchQueries: [UserOverviewSearchDocument],
  });

  isInvitingUser = this.inviteUserMutation.loading;

  selectedActorId = signal<string | null>(null);

  actors = query(GetFilteredActorsDocument);

  actorOptions = computed<WattDropdownOptions>(() =>
    (this.actors.data()?.filteredActors ?? []).map((actor) => ({
      displayValue:
        actor.name + ' (' + translate(`marketParticipant.marketRoles.${actor.marketRole}`) + ')',
      value: actor.id,
    }))
  );

  domains = computed(
    () =>
      this.actors.data()?.filteredActors.find((x) => x.id === this.selectedActorId())?.organization
        .domains
  );

  inOrganizationMailDomain = computed(() => {
    const email = this.emailChanged();
    const domains = this.domains();

    return (
      !!email &&
      !!domains &&
      domains.some((domain) => email.toUpperCase().endsWith(domain.toUpperCase()))
    );
  });

  emailExists = computed(() => {
    const email = this.emailChanged();
    return !!email && this.knownEmails().includes(email.toUpperCase());
  });

  domainExists = computed((): boolean => {
    const email = this.emailChanged();
    return !!email && (this.validDomainQuery.data()?.domainExists ?? false);
  });

  knownEmailsQuery = query(GetKnownEmailsDocument);
  validDomainQuery = lazyQuery(CheckDomainExistsDocument);

  knownEmails = computed(
    () => this.knownEmailsQuery.data()?.knownEmails.map((x) => x.toUpperCase()) ?? []
  );

  isLoadingEmails = computed(() => this.knownEmailsQuery.loading());
  checkingForAssociatedActors = computed(() => this.checkForAssociatedActors.loading());
  checkForAssociatedActors = lazyQuery(GetAssociatedActorsDocument);

  baseInfo = this.nonNullableFormBuilder.group({
    actorId: ['', Validators.required],
    email: [
      { value: '', disabled: true },
      [Validators.required, Validators.email],
      [
        (control) => {
          if (control.value) {
            return this.checkForAssociatedActors
              .query({ variables: { email: control.value } })
              .then((result) => {
                const associatedActors = result.data?.associatedActors.actors ?? [];

                const isAlreadyAssociatedToActor = associatedActors?.includes(
                  this.baseInfo.controls.actorId.value ?? ''
                );

                return isAlreadyAssociatedToActor ? { userAlreadyAssignedActor: true } : null;
              });
          }

          return of(null);
        },
        (control) => {
          if (control.value) {
            return this.validDomainQuery
              .query({ variables: { email: control.value } })
              .then((domainCheck) => {
                return !domainCheck.data.domainExists ? { domainDoesNotExist: true } : null;
              });
          }

          return of(null);
        },
      ],
    ],
  });

  emailChanged = toSignal(this.baseInfo.controls.email.valueChanges);

  actorIdChanged = toSignal(this.baseInfo.controls.actorId.valueChanges);

  userInfo = this.nonNullableFormBuilder.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    phoneNumber: ['', [Validators.required]],
  });

  userRoles = this.nonNullableFormBuilder.group({
    selectedUserRoles: [[] as string[], Validators.required],
  });

  constructor() {
    effect(() => {
      const actors = this.actors.data()?.filteredActors;

      if (actors !== undefined && actors.length === 1) {
        const [firstActor] = actors;
        this.baseInfo.controls.actorId.setValue(firstActor.id);
      }
    });

    effect(
      () => {
        const actorId = this.actorIdChanged();

        actorId !== null
          ? this.baseInfo.controls.email.enable()
          : this.baseInfo.controls.email.disable();

        if (!actorId) return;

        this.selectedActorId.set(actorId);
        this.baseInfo.updateValueAndValidity();
        this.changeDectorRef.detectChanges();
      },
      { allowSignalWrites: true }
    );
  }

  open() {
    this.inviteUserModal().open();
  }

  inviteUser() {
    if (!this.isBaseInfoValid() || !this.isNewUserInfoValid() || !this.isRolesInfoValid()) {
      return;
    }

    const { firstname, lastname, phoneNumber } = this.userInfo.controls;
    const { email, actorId } = this.baseInfo.controls;

    const phoneParts = phoneNumber.value.split(' ');
    const [prefix, ...rest] = phoneParts;
    const formattedPhoneNumber = `${prefix} ${rest.join('')}`;

    this.inviteUserMutation.mutate({
      variables: {
        input: {
          userInviteDto: {
            invitationUserDetails:
              firstname.value && lastname.value && phoneNumber.value
                ? {
                    firstName: firstname.value,
                    lastName: lastname.value,
                    phoneNumber: formattedPhoneNumber,
                  }
                : undefined,
            email: email.value,
            assignedActor: actorId.value,
            assignedRoles: this.userRoles.controls.selectedUserRoles.value,
          },
        },
      },
      onCompleted: (res) => {
        res.inviteUser.errors
          ? this.onInviteError(res.inviteUser.errors)
          : this.onInviteSuccess(email.value);
      },
      onError: () => this.onInviteError(),
    });
  }

  onSelectedUserRoles(userRoles: UserRoleItem[]) {
    this.userRoles.controls.selectedUserRoles.markAsTouched();
    this.userRoles.controls.selectedUserRoles.setValue(userRoles.map((userRole) => userRole.id));
  }

  closeModal(status: boolean) {
    this.closed.emit();
    this.inviteUserModal().close(status);
  }

  private onInviteSuccess(email: string | null) {
    this.toastService.open({
      type: 'success',
      message: `${this.translocoService.translate(
        'admin.userManagement.inviteUser.successMessage',
        { email: email }
      )}`,
    });
    this.closeModal(true);
  }

  private onInviteError(apiErrorCollection: ApiErrorCollection[] | undefined = undefined) {
    const message = apiErrorCollection
      ? readApiErrorResponse(apiErrorCollection)
      : this.translocoService.translate(
          'admin.userManagement.inviteUser.serverErrors.generalError'
        );

    this.toastService.open({ type: 'danger', message, duration: 60_000 });
  }

  private isBaseInfoValid() {
    return this.baseInfo.valid;
  }

  private isNewUserInfoValid() {
    return this.userInfo.valid || this.emailExists() || !this.inOrganizationMailDomain();
  }

  private isRolesInfoValid() {
    return this.userRoles.valid;
  }
}
