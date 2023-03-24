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
import { firstValueFrom, Subject } from 'rxjs';

import {
  MarketParticipantUserHttp,
  MarketParticipantUserAuditLogsDto,
  MarketParticipantUserAuditLogDto,
} from '@energinet-datahub/dh/shared/domain';
import {
  DhAdminUserManagementAuditLogsDataAccessApiStore,
  DhUserAuditLogEntry,
} from './dh-admin-user-management-audit-logs-data-access-api.store';

describe(DhAdminUserManagementAuditLogsDataAccessApiStore.name, () => {
  test('should return a mapped audit log', async () => {
    // arrange
    const userAuditLogs: MarketParticipantUserAuditLogDto[] = [
      {
        timestamp: '2023-01-09T14:40:23+00:00',
        auditLogType: 'UserRoleAdded',
        changedByUserName: 'fake_value',
        toValue: 'fake_user_role',
      },
    ];
    const expected: DhUserAuditLogEntry[] = [
      {
        timestamp: userAuditLogs[0].timestamp,
        entry: userAuditLogs[0],
      },
    ];

    const observable = new Subject<MarketParticipantUserAuditLogsDto>();
    const httpClient = {
      v1MarketParticipantUserGetUserAuditLogsGet: () => observable.asObservable(),
    } as MarketParticipantUserHttp;

    const target = new DhAdminUserManagementAuditLogsDataAccessApiStore(httpClient);

    // act
    target.getAuditLogs('5CF885C5-4EEB-4265-8E48-879EDA779D88');
    observable.next({ userAuditLogs });
    observable.complete();

    // assert
    expect(await firstValueFrom(target.auditLogs$)).toStrictEqual(expected);
  });

  test('should set success state on completion', async () => {
    // arrange
    const userAuditLogs: MarketParticipantUserAuditLogDto[] = [];

    const observable = new Subject<MarketParticipantUserAuditLogsDto>();
    const httpClient = {
      v1MarketParticipantUserGetUserAuditLogsGet: () => observable.asObservable(),
    } as MarketParticipantUserHttp;

    const target = new DhAdminUserManagementAuditLogsDataAccessApiStore(httpClient);

    // act
    target.getAuditLogs('4DBBB8EC-750E-40F0-828D-5F23332A74D1');
    observable.next({ userAuditLogs });
    observable.complete();

    // assert
    expect(await firstValueFrom(target.isLoading$)).toBe(false);
    expect(await firstValueFrom(target.auditLogCount$)).toBe(0);
    expect(await firstValueFrom(target.hasGeneralError$)).toBe(false);
    expect(await firstValueFrom(target.auditLogs$)).toStrictEqual([]);
  });

  test('should set error state on error', async () => {
    // arrange
    const observable = new Subject<MarketParticipantUserAuditLogsDto>();
    observable.error('test_error');

    const httpClient = {
      v1MarketParticipantUserGetUserAuditLogsGet: () => observable.asObservable(),
    } as MarketParticipantUserHttp;

    const target = new DhAdminUserManagementAuditLogsDataAccessApiStore(httpClient);

    // act
    target.getAuditLogs('F27D9A8E-DD69-4E72-97ED-CB829794571F');

    // assert
    expect(await firstValueFrom(target.isLoading$)).toBe(false);
    expect(await firstValueFrom(target.auditLogCount$)).toBe(0);
    expect(await firstValueFrom(target.hasGeneralError$)).toBe(true);
    expect(await firstValueFrom(target.auditLogs$)).toStrictEqual([]);
  });
});
