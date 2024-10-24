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

describe('Start requests Test', () => {


  it(`Start Aggregering requet`, () => {

    cy.visit('/');
    //Change user role
    cy.changeUserRole('Elleverandør', '5790000392551');

    //Open request-calculation
    cy.visit('/wholesale/request-calculation');

    //navigate to request-calculation
    cy.url().should('include', '/request-calculation');

    // Verify that we are on the correct side
    cy.findByRole('heading', {name: new RegExp('Anmod om beregningsdata', 'i'), });

    // Specify the calculation type Aggregering, daterange and
    cy.selectOption('mat-select-value-5', 'Produktion');
    cy.typeDateRange('watt-datepicker-0', '01-02-2023', '28-02-2023');

    //Create calculation
    cy.findByRole('button', {name: new RegExp('Anmod','i')}).click();

    // //Validate the calculation is successful created
    cy.get('watt-toast')
    .should('exist')
    .and('be.visible')
    .within(() => {
      cy.get('p').should('contain.text', 'Din anmoding er startet');
    });
  });
});
