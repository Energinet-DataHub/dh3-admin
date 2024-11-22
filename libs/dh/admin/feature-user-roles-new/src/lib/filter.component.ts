import { Component, effect, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRolesFilter } from '@energinet-datahub/dh/admin/data-access-api';
import {
  EicFunction,
  GetFilteredUserRolesQueryVariables,
  UserRoleStatus,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhPermissionRequiredDirective } from '@energinet-datahub/dh/shared/feature-authorization';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/directives';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { VaterStackComponent } from '@energinet-datahub/watt/vater';
import { TranslocoDirective } from '@ngneat/transloco';
import { map, startWith } from 'rxjs';

@Component({
  standalone: true,
  selector: 'dh-user-roles-filter',
  imports: [
    TranslocoDirective,
    FormsModule,
    ReactiveFormsModule,
    WattDropdownComponent,
    VaterStackComponent,
    DhPermissionRequiredDirective,
    DhDropdownTranslatorDirective,
    WattQueryParamsDirective,
  ],
  template: `<form
    vater-stack
    direction="row"
    gap="s"
    tabindex="-1"
    [formGroup]="form"
    wattQueryParams
    *transloco="let t; read: 'admin.userManagement.tabs.roles.filter'"
  >
    <watt-dropdown
      dhDropdownTranslator
      translateKey="admin.userManagement.roleStatus"
      [placeholder]="t('status')"
      [formControl]="form.controls.status"
      [options]="statusOptions"
      [chipMode]="true"
    />

    <watt-dropdown
      *dhPermissionRequired="['fas']"
      dhDropdownTranslator
      translateKey="marketParticipant.marketRoles"
      [placeholder]="t('marketRole')"
      [formControl]="form.controls.marketRoles"
      [options]="marketRolesOptions"
      [multiple]="true"
      [chipMode]="true"
    />
  </form>`,
})
export class DhUserRolesFilterComponent {
  form = new FormGroup({
    status: dhMakeFormControl(UserRoleStatus.Active),
    marketRoles: dhMakeFormControl([]),
  });

  statusOptions = dhEnumToWattDropdownOptions(UserRoleStatus);
  marketRolesOptions = dhEnumToWattDropdownOptions(EicFunction);

  filter = output<GetFilteredUserRolesQueryVariables>();

  values = toSignal<GetFilteredUserRolesQueryVariables>(
    this.form.valueChanges.pipe(
      startWith(null),
      map(() => this.form.getRawValue()),
      exists(),
      map(({ marketRoles, status }) => ({
        eicFunctions: marketRoles,
        status: status,
      }))
    ),
    { requireSync: true }
  );

  constructor() {
    effect(() => {
      this.filter.emit(this.values());
    });
  }
}
