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
const environments = [
  {
    name: 'U001',
    url: 'https://jolly-sand-03f839703.azurestaticapps.net/',
  },
  {
    name: 'U002',
    url: 'https://wonderful-field-057109603.1.azurestaticapps.net/',
  },
  {
    name: 'T001',
    url: 'https://ashy-forest-09ecf8003.2.azurestaticapps.net/',
  },
];

environments.forEach((env) => {
  it(`[B2C Healthcheck] ${env.name}`, { retries: 3 }, () => {
    // Should be able to reach the app
    cy.request(env.url).then((resp) => {
      expect(resp.status).to.eq(200);
    });

    // Should have correct redirect_uri
    cy.visit(env.url);
    cy.location('href', { timeout: 10000 }).should((url) => {
      expect(url).to.include(`redirect_uri=${encodeURIComponent(env.url)}`);
    });
  });
});
