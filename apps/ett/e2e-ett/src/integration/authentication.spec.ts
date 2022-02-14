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
import * as appShell from '../support/app-shell.po';
import * as authApi from '../support/auth-api';
import * as dashboardPage from '../support/dashboard.po';
import * as landingPage from '../support/landing-page.po';

describe('Authentication', () => {
  it(`Given a commercial user
    When NemID authentication is successful
    Then they are redirected to the dashboard page`, () => {
    // Arrange
    authApi.allowAuthentication();
    landingPage.navigateTo();

    // Act
    landingPage.findStartLink().click();

    // Assert
    dashboardPage.findTitle().should('be.visible');
  });

  it(`Given an authenticated commercial user
    When the "Log out" menu item is clicked
      And log out is successful
    Then they are redirected to the landing page`, () => {
    // Arrange
    authApi.allowAuthentication();
    authApi.allowLogOut();
    landingPage.navigateTo();
    landingPage.findStartLink().click();
    // Wait for animation to finish
    appShell.findMenu().should('be.visible');

    // Act
    appShell.findLogOutMenuItem().click();
    cy.wait('@authLogout');

    // Assert
    cy.location('pathname').should('eq', landingPage.path);
  });
});
