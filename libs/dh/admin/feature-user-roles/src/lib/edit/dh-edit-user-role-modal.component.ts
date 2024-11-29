import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
  DestroyRef,
  viewChild,
  computed,
} from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { combineLatest, map, tap } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { RxLet } from '@rx-angular/template/let';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { WattToastService } from '@energinet-datahub/watt/toast';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattModalComponent, WATT_MODAL } from '@energinet-datahub/watt/modal';
import { WattTabComponent, WattTabsComponent } from '@energinet-datahub/watt/tabs';
import { WattSpinnerComponent } from '@energinet-datahub/watt/spinner';
import { WattTextFieldComponent } from '@energinet-datahub/watt/text-field';
import { WattFieldErrorComponent } from '@energinet-datahub/watt/field';
import { WATT_CARD } from '@energinet-datahub/watt/card';
import {
  DhAdminUserRoleEditDataAccessApiStore,
  DhUserRoleManagementStore,
  DhUserRoleWithPermissions,
} from '@energinet-datahub/dh/admin/data-access-api';
import { WattTextAreaFieldComponent } from '@energinet-datahub/watt/textarea-field';
import { DhPermissionsTableComponent } from '@energinet-datahub/dh/admin/shared';
import {
  GetPermissionByEicFunctionDocument,
  PermissionDetailsDto,
  UpdateUserRoleDtoInput,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { lazyQuery } from '@energinet-datahub/dh/shared/util-apollo';

@Component({
  selector: 'dh-edit-user-role-modal',
  templateUrl: './dh-edit-user-role-modal.component.html',
  standalone: true,
  styles: [
    `
      .tab-master-data {
        width: 25rem;
      }

      .spinner-container {
        display: flex;
        justify-content: center;
        margin-top: var(--watt-space-m);
      }
    `,
  ],
  providers: [DhAdminUserRoleEditDataAccessApiStore],
  imports: [
    RxPush,
    RxLet,
    WATT_MODAL,
    TranslocoDirective,
    ReactiveFormsModule,

    WattButtonComponent,
    WattTabComponent,
    WattTabsComponent,
    WattSpinnerComponent,
    WattTextFieldComponent,
    WattFieldErrorComponent,
    WATT_CARD,
    WattTextAreaFieldComponent,

    DhPermissionsTableComponent,
  ],
})
export class DhEditUserRoleModalComponent implements OnInit, AfterViewInit {
  private userRoleEditStore = inject(DhAdminUserRoleEditDataAccessApiStore);
  private destroyRef = inject(DestroyRef);
  private userRoleWithPermissionsStore = inject(DhUserRoleManagementStore);

  private formBuilder = inject(FormBuilder);
  private toastService = inject(WattToastService);
  private transloco = inject(TranslocoService);

  private skipFirstPermissionSelectionEvent = true;

  userRole$ = this.userRoleWithPermissionsStore.userRole$;
  roleName$ = this.userRole$.pipe(map((role) => role.name));

  permissionsQuery = lazyQuery(GetPermissionByEicFunctionDocument);

  permissions = computed<PermissionDetailsDto[]>(
    () => this.permissionsQuery.data()?.permissionsByEicFunction ?? []
  );

  private marketRolePermissions$ = toObservable(this.permissions);
  initiallySelectedPermissions$ = combineLatest([this.marketRolePermissions$, this.userRole$]).pipe(
    map(([marketRolePermissions, userRole]) => {
      return marketRolePermissions.filter((marketRolePermission) => {
        return userRole.permissions.some(
          (userRolePermission) => userRolePermission.id === marketRolePermission.id
        );
      });
    }),
    tap((initiallySelectedPermissions) => {
      this.skipFirstPermissionSelectionEvent = initiallySelectedPermissions.length > 0;
    })
  );
  marketRolePermissionsIsLoading = this.permissionsQuery.loading;

  hasError = this.permissionsQuery.hasError;

  isLoading$ = this.userRoleEditStore.isLoading$;
  validationError$ = this.userRoleEditStore.validationError$;

  userRoleEditForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required]),
    description: this.formBuilder.nonNullable.control('', [Validators.required]),
    permissionIds: this.formBuilder.nonNullable.control<number[]>([], [Validators.required]),
  });

  @ViewChild(WattModalComponent) editUserRoleModal!: WattModalComponent;

  tabs = viewChild(WattTabsComponent);

  @Output() closed = new EventEmitter<{ saveSuccess: boolean }>();

  ngOnInit(): void {
    this.userRole$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((userRole) => {
      const permissionIds = userRole.permissions.map(({ id }) => id);

      this.userRoleEditForm.patchValue({
        name: userRole.name,
        description: userRole.description,
        permissionIds,
      });

      this.permissionsQuery.refetch({ eicFunction: userRole.eicFunction });
    });

    this.validationError$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((x) => {
      if (x?.errorCode === 'market_participant.validation.market_role.reserved') {
        this.userRoleEditForm.controls.name.setErrors({
          nameAlreadyExists: true,
        });
        return;
      }

      this.userRoleEditForm.controls.name.setErrors(null);

      if (x?.errorCode) {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate(`marketParticipant.${x.errorCode}`),
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.editUserRoleModal.open();
  }

  closeModal(saveSuccess: boolean): void {
    this.editUserRoleModal.close(saveSuccess);
    this.closed.emit({ saveSuccess });
  }

  onSelectionChanged(selectedPermissions: PermissionDetailsDto[]): void {
    if (this.skipFirstPermissionSelectionEvent) {
      this.skipFirstPermissionSelectionEvent = false;

      return;
    }

    const permissionIds = selectedPermissions.map(({ id }) => id);

    this.userRoleEditForm.patchValue({ permissionIds });
    this.userRoleEditForm.markAsDirty();
  }

  save(userRole: DhUserRoleWithPermissions): void {
    if (this.userRoleEditForm.invalid) {
      if (this.userRoleEditForm.controls.description.hasError('required')) {
        this.tabs()?.setSelectedIndex(0);
      }
      return;
    }

    if (this.userRoleEditForm.pristine) {
      return this.closeModal(false);
    }

    const formControls = this.userRoleEditForm.controls;

    const updatedUserRole: UpdateUserRoleDtoInput = {
      name: formControls.name.value,
      description: formControls.description.value,
      permissions: formControls.permissionIds.value,
      status: userRole.status,
    };

    const onSuccessFn = () => {
      const message = this.transloco.translate('admin.userManagement.editUserRole.saveSuccess');

      this.toastService.open({ type: 'success', message });
      this.closeModal(true);
    };

    const onErrorFn = (statusCode: HttpStatusCode) => {
      if (statusCode !== HttpStatusCode.BadRequest) {
        this.toastService.open({
          type: 'danger',
          message: this.transloco.translate('admin.userManagement.editUserRole.saveError'),
        });
      }
    };

    this.userRoleEditStore.updateUserRole({
      userRoleId: userRole.id,
      updatedUserRole,
      onSuccessFn,
      onErrorFn,
    });
  }
}
