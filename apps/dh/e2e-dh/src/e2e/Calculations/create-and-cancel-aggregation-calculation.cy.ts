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
import dayjs from 'dayjs';

describe('Create and cancel scheduled calculation Test', () => {

  const nextMonth = dayjs().add(1, 'month').format('DD-MM-YYYY');

  it(`Create and cancel scheduled calculation`, () => {
    // Create calculation
    cy.visit('/wholesale/calculations');

    //navigate to calculations
    cy.url().should('include', '/calculations');

    // Verify that we are on the correct side
    cy.findByRole('heading', {name: new RegExp('Beregninger', 'i'), });

    //Open New calculation dialog
    cy.contains('button', 'Ny beregning').click();

    //Schedule calculation
    cy.contains('label', 'Planlæg beregning').find('input[type="radio"]').check();
    cy.get('#watt-datepicker-1 > .watt-field--unlabelled > label > vater-stack > .watt-field-wrapper').type(nextMonth);
    cy.get('#watt-timepicker-0 > .watt-field--unlabelled > label > vater-stack > .watt-field-wrapper').type('12:00');

    // Verify that the dialog is shown
    cy.get('.watt-modal').should('be.visible');

    // Choose the chip button "Ekstern" i the dialog
    cy.get('watt-filter-chip').contains('Ekstern').click();

    // Specify the calculation type Aggregering, daterange and
    cy.selectOption('mat-select-0', 'Aggregering');
    cy.typeDateRange('watt-datepicker-0', '01-02-2023', '28-02-2023');

    //Create calculation
    cy.findByRole('button', {name: new RegExp('Opret beregning','i')}).click();

    //Validate the calculation is successful created
    cy.contains('.watt-toast', 'Din beregning er oprettet.').should('be.visible');
  });
});
