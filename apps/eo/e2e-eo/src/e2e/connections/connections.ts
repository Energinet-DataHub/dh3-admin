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
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

import { LandingPagePO, LoginPo, SharedPO } from '../../page-objects';

import { ConnectionsPo } from '../../page-objects/connections.po';

const po = new ConnectionsPo();
const landingPage = new LandingPagePO();
const login = new LoginPo();
const shared = new SharedPO();

const mockedConnections = [
  { id: 'ID1', companyTin: 'tin 1', companyId: 'id 1', name: 'name 1' },
  { id: 'ID2', companyTin: 'tin 2', companyId: 'id 2', name: 'name 2' },
  { id: 'ID3', companyTin: 'tin 3', companyId: 'id 3', name: 'name 3' },
];

Given('I am logged in as Charlotte CSR', () => {
  landingPage.navigateTo();
  shared.clickOnlyNecessaryButton(); // To get rid of Cookie Consent banner
  landingPage.clickLoginButton();
  login.clickCharlotteLogin();
});

When('I go to the connections page', () => {
  cy.intercept('GET', 'https://demo.energioprindelse.dk/api/connections', {
      statusCode: 200,
      body: {
        result: mockedConnections
      },
    });


  shared.clickConnectionsMenuItem();
  po.urlIsTransfersPage();
  po.headerIsVisible();
});

When('I click on the "new invitation" button', () => {
  po.clickNewInvitationButton();
});

When('I click on the "removal" button of a connection', () => {
  po.clickRemoveConnectionButton();
});

When('I confirm I want to remove the connection', () => {
  po.clickConfirmRemoveConnectionButton();
})

Then('I can see a invitation link', () => {
  po.invitationLinkIsVisible();
});

Then('I have a button which copies the invitation link', () => {
  po.clickCopyInitiationLinkButton();
});

Then('the connection is removed from the table', () => {
  cy.get('eo-connections-table').should('not.contain', mockedConnections[0].companyId);
  cy.get('eo-connections-table').should('contain', mockedConnections[1].companyId);
  cy.get('eo-connections-table').should('contain', mockedConnections[2].companyId);
});

Then('the badge of total connections updates', () => {
  cy.get('.badge').should('contain.text', '2');
});
