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
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';

import { ErrorState, LoadingState } from '@energinet-datahub/dh/shared/data-access-api';
import {
  MarketParticipantUserRoleHttp,
  MarketParticipantUserRoleAuditLogDto,
  MarketParticipantUserRoleAuditLogsDto,
} from '@energinet-datahub/dh/shared/domain';

import { mapChangeDescriptionJson } from './util/map-change-description-json';

type ChangeType = 'added' | 'removed';

type UserRoleAuditLogExtended = MarketParticipantUserRoleAuditLogDto & {
  changedValueTo: string;
  changeType?: ChangeType;
};

export interface DhRoleAuditLogEntry {
  readonly timestamp: string;
  readonly entry: UserRoleAuditLogExtended;
}

interface DhUserRoleAuditLogsState {
  readonly auditLogs: DhRoleAuditLogEntry[];
  readonly requestState: LoadingState | ErrorState;
}

const initialState: DhUserRoleAuditLogsState = {
  auditLogs: [],
  requestState: LoadingState.INIT,
};

@Injectable()
export class DhAdminUserRoleAuditLogsDataAccessApiStore extends ComponentStore<DhUserRoleAuditLogsState> {
  readonly isLoading$ = this.select((state) => state.requestState === LoadingState.LOADING);

  readonly hasGeneralError$ = this.select(
    (state) => state.requestState === ErrorState.GENERAL_ERROR
  );

  readonly auditLogs$ = this.select((state) => state.auditLogs);
  readonly auditLogCount$ = this.select((state) => state.auditLogs.length);

  constructor(private httpClient: MarketParticipantUserRoleHttp) {
    super(initialState);
  }

  readonly getAuditLogs = this.effect((userRoleId$: Observable<string>) =>
    userRoleId$.pipe(
      tap(() => {
        this.setLoading(LoadingState.LOADING);
      }),
      switchMap((userRoleId) =>
        this.httpClient.v1MarketParticipantUserRoleGetUserRoleAuditLogsGet(userRoleId).pipe(
          tapResponse(
            (response) => {
              this.assignAuditLogs(response);
              this.setLoading(LoadingState.LOADED);
            },
            () => {
              this.handleError();
            }
          )
        )
      )
    )
  );

  private assignAuditLogs = (response: MarketParticipantUserRoleAuditLogsDto) => {
    const auditLogs: DhRoleAuditLogEntry[] = response.auditLogs
      .filter((x) => x.userRoleChangeType !== 'PermissionsChange')
      .map((entry) => ({
        entry: {
          ...entry,
          changedValueTo: mapChangeDescriptionJson(
            entry.userRoleChangeType,
            this.parseChangeDescriptionJson(entry.changeDescriptionJson)
          ),
        },
        timestamp: entry.timestamp,
      }));

    const orderedPermissionChanges = response.auditLogs
      .filter((entry) => entry.userRoleChangeType === 'PermissionsChange')
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    orderedPermissionChanges.forEach((entry, i) => {
      const prevPermissions =
        i > 0
          ? (JSON.parse(orderedPermissionChanges[i - 1].changeDescriptionJson)
              .Permissions as number[])
          : [];
      const currPermissions = JSON.parse(entry.changeDescriptionJson).Permissions as number[];

      const permissionChagnes: { type: ChangeType; perms: number[] }[] = [
        { type: 'added', perms: currPermissions.filter((perm) => !prevPermissions.includes(perm)) },
        { type: 'removed', perms: prevPermissions.filter((perm) => !currPermissions.includes(perm)) },
      ];

      permissionChagnes.forEach((x) =>
        x.perms.forEach((y) =>
          auditLogs.push({
            entry: {
              ...entry,
              changedValueTo: `${y}`,
              changeType: x.type,
            },
            timestamp: entry.timestamp,
          })
        )
      );
    });

    this.patchState({ auditLogs });
  };

  private setLoading = (state: LoadingState) => {
    this.patchState({ requestState: state });
  };

  private handleError = () => {
    this.assignAuditLogs({ auditLogs: [] });
    this.patchState({ requestState: ErrorState.GENERAL_ERROR });
  };

  private parseChangeDescriptionJson(changeDescriptionJson: string) {
    try {
      return JSON.parse(changeDescriptionJson);
    } catch (error) {
      throw new Error(`Invalid JSON: ${JSON.stringify(changeDescriptionJson)}`);
    }
  }
}
