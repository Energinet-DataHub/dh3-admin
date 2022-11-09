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
export default class LoginPage {
  getButtonWithValue = (value: string) =>
    cy.get('button').should('have.value', value);

  findTitle = cy.get('h2[class="action-text"]');
  getCharlotteCSR = this.getButtonWithValue('Charlotte CSR');
  getThomasTesla = this.getButtonWithValue('Thomas Tesla');
  getIvanIvaerksaetter = this.getButtonWithValue('Ivan Iværksætter');
}
