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
import { flatten, translate } from '@ngneat/transloco';

import { ApiError, ApiErrorDescriptor } from '@energinet-datahub/dh/shared/domain/graphql';

export type ApiErrorCollection = Pick<ApiError, 'apiErrors'>;

export const readApiErrorResponse = (errors: ApiErrorCollection[]) => {
  return errors
    .flatMap((error) => error.apiErrors)
    .map(translateApiError)
    .join(' ');
};

const translateApiError = (errorDescriptor: ApiErrorDescriptor) => {
  const translationKey = `marketParticipant.${errorDescriptor.code}`;
  const translation = translate(
    translationKey,
    flatten(translateArgs(errorDescriptor.args, translationKey))
  );
  return translationKey === translation
    ? translate(`marketParticipant.market_participant.error_fallback`, {
        message: errorDescriptor.message,
      })
    : translation;
};

const translateArgs = (args: Record<string, string>, code: string) =>
  Object.entries(args).reduce((acc, [key, value]) => {
    const translationPath = code.split('.');
    translationPath.pop();
    const translationKey = `${translationPath.join('.')}.args.${key}.${value}`;
    const translation = translate(translationKey);
    return { ...acc, [key]: translationKey === translation ? translationKey : translation };
  }, {});
