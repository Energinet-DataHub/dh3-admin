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
import { DefaultBodyType, delay, http, HttpResponse, StrictResponse } from 'msw';

import { mswConfig } from '@energinet-datahub/gf/util-msw';

import { actors } from './data/message-archive-actors';
import { messageArchiveSearchResponseLogs } from './data/message-archive-search-response-logs';
import { document, documentJson } from './data/message-archived-document';

export function messageArchiveMocks(apiBase: string) {
  return [archivedMessageSearch(apiBase), getActors(apiBase), getDocument(apiBase)];
}

export function archivedMessageSearch(apiBase: string) {
  return http.post(`${apiBase}/v1/MessageArchive/SearchRequestResponseLogs`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(messageArchiveSearchResponseLogs, { status: 200 });
  });
}

export function getActors(apiBase: string) {
  return http.get(`${apiBase}/v1/MessageArchive/Actors`, async () => {
    await delay(mswConfig.delay);
    return HttpResponse.json(actors, { status: 200 });
  });
}

export function getDocument(apiBase: string) {
  return http.get(
    `${apiBase}/v1/MessageArchive/:id/Document`,
    async (): Promise<StrictResponse<DefaultBodyType>> => {
      await delay(mswConfig.delay);
      const random = Math.floor(Math.random() * 1000);

      console.log(random);
      return random % 2 === 0
        ? HttpResponse.text(document, { headers: { 'Content-Type': 'text/xml' } })
        : HttpResponse.json(documentJson, { headers: { 'Content-Type': 'application/json' } });
    }
  );
}
