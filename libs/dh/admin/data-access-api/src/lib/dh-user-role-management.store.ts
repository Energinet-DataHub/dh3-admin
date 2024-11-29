import { inject, Injectable } from '@angular/core';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { Apollo } from 'apollo-angular';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/domain';
import {
  DeactivateUserRoleDocument,
  GetUserRoleWithPermissionsDocument,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { DhUserRoleWithPermissions } from './types/user-role.type';

interface DhUserRoleManagementState {
  readonly userRole: DhUserRoleWithPermissions | null;
  readonly requestState: LoadingState | ErrorState;
  readonly deactivateUserRoleRequestState: LoadingState | ErrorState;
}

const initialState: DhUserRoleManagementState = {
  userRole: null,
  requestState: LoadingState.INIT,
  deactivateUserRoleRequestState: LoadingState.INIT,
};

@Injectable()
export class DhUserRoleManagementStore extends ComponentStore<DhUserRoleManagementState> {
  private readonly apollo = inject(Apollo);

  isInit$ = this.select((state) => state.requestState === LoadingState.INIT);
  isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);
  hasGeneralError$ = this.select((state) => state.requestState === ErrorState.GENERAL_ERROR);

  deactivateUserRoleIsLoading$ = this.select(
    (state) => state.deactivateUserRoleRequestState === LoadingState.LOADING
  );

  userRole$ = this.select((state) => state.userRole).pipe(
    filter((userRole): userRole is DhUserRoleWithPermissions => userRole != null)
  );

  constructor() {
    super(initialState);
  }

  readonly getUserRole = this.effect((userId$: Observable<string>) =>
    userId$.pipe(
      tap(() => {
        this.resetState();
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((userRoleId) =>
        this.apollo
          .query({
            query: GetUserRoleWithPermissionsDocument,
            variables: { id: userRoleId },
            fetchPolicy: 'network-only',
          })
          .pipe(
            tapResponse(
              (response) => {
                this.updateUserRole(response.data.userRoleById);
                this.setLoading(LoadingState.LOADED);
              },
              () => {
                this.setLoading(LoadingState.LOADED);
                this.updateUserRole(null);
                this.handleError();
              }
            )
          )
      )
    )
  );

  readonly disableUserRole = this.effect(
    (
      trigger$: Observable<{
        userRoleId: string;
        onSuccessFn: () => void;
      }>
    ) =>
      trigger$.pipe(
        switchMap(({ userRoleId, onSuccessFn }) =>
          this.apollo
            .mutate({
              mutation: DeactivateUserRoleDocument,
              variables: {
                input: {
                  roleId: userRoleId,
                },
              },
            })
            .pipe(
              tapResponse(
                (response) => {
                  if (response.loading) {
                    this.patchState({ deactivateUserRoleRequestState: LoadingState.LOADING });
                    return;
                  }

                  this.patchState({ deactivateUserRoleRequestState: LoadingState.LOADED });
                  onSuccessFn();
                },
                () => {
                  this.patchState({ deactivateUserRoleRequestState: ErrorState.GENERAL_ERROR });
                }
              )
            )
        )
      )
  );

  private updateUserRole = this.updater(
    (
      state: DhUserRoleManagementState,
      response: DhUserRoleWithPermissions | null
    ): DhUserRoleManagementState => ({
      ...state,
      userRole: response,
    })
  );

  private setLoading = this.updater(
    (state, loadingState: LoadingState): DhUserRoleManagementState => ({
      ...state,
      requestState: loadingState,
    })
  );

  private handleError = () => {
    this.updateUserRole(null);
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private resetState = () => this.setState(initialState);
}
