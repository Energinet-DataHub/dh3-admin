//#region License
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
//#endregion
import { GetRelevantGridAreasDocument } from '@energinet-datahub/dh/shared/domain/graphql';
import { WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattRange } from '@energinet-datahub/watt/date';
import { query } from '@energinet-datahub/dh/shared/util-apollo';

export async function getGridAreaOptionsForPeriod(
  period: WattRange<Date>,
  actorId: string
): Promise<WattDropdownOptions> {
  const result = await query(GetRelevantGridAreasDocument, {
    variables: {
      period,
      actorId,
    },
  }).result();

  return result.data.relevantGridAreas.map((gridArea) => ({
    value: gridArea.code,
    displayValue: gridArea.displayName,
  }));
}
