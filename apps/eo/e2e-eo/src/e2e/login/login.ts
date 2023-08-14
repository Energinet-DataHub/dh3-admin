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
import { DashboardPo, LandingPagePO, LoginPo, SharedPO } from '../../page-objects';

const landingPage = new LandingPagePO();
const login = new LoginPo();
const shared = new SharedPO();
const dashboardPage = new DashboardPo();

Given('I am on the landing page', () => {
  landingPage.navigateTo();
  landingPage.headerIsVisible();
});

Given('I am logged in as Charlotte CSR', () => {
  landingPage.navigateTo();
  shared.clickOnlyNecessaryButton(); // To get rid of Cookie Consent banner
  landingPage.clickLoginButton();
  login.clickCharlotteLogin();
});

When('I click the first start button to login', () => {
  landingPage.clickLoginButton();
});

When('I see Charlotte CSRs login button and click it', () => {
  login.clickCharlotteLogin();
});

When("I see Thomas Tesla's login button and click it", () => {
  login.clickThomasLogin();
});

When('I see Ivan Iværksætters login button and click it', () => {
  login.clickIvanLogin();
});

When('I see Peter Producents login button and click it', () => {
  login.clickPeterLogin();
});

Then('I can see the dashboard page', () => {
  dashboardPage.headerIsVisible();
  shared.clickLogoutMenuItem();
});

Then('I am on the landing page again with an error in the URL', () => {
  landingPage.headerIsVisible();
  landingPage.urlShowsPrivateUserNotAllowed();
});
