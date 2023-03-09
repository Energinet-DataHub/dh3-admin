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
import { Pipe, PipeTransform } from '@angular/core';
import { WattTableDataSource } from '@energinet-datahub/watt/table';
import { ActorMarketRoleViewDto, UserRoleViewDto } from '@energinet-datahub/dh/shared/domain';

@Pipe({ name: 'joinMarketRoles', standalone: true })
export class JoinMarketRoles implements PipeTransform {
  transform(marketRoles: ActorMarketRoleViewDto[] | null | undefined) {
    return marketRoles?.map((marketRole) => marketRole.eicFunction).join(', ') ?? '';
  }
}

@Pipe({ name: 'testPipe', standalone: true })
export class TestPipe implements PipeTransform {

  readonly dataSource: WattTableDataSource<UserRoleViewDto> = new WattTableDataSource<UserRoleViewDto>();

  transform(marketRoles: UserRoleViewDto[] | null | undefined) {
    this.dataSource.data = marketRoles || [];
    return this.dataSource;
  }
}
