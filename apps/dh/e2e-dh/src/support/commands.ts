import '@testing-library/cypress/add-commands';
// Appearantly there are some issues with `paths` so we need to use absolute paths for now.
import { da as daTranslations } from '@energinet-datahub/dh/globalization/assets-localization';

function loginViaB2C(email: string, password: string) {
  cy.visit('/');

  // Login to B2C.
  cy.origin(
    'https://devdatahubb2c.b2clogin.com',
    {
      args: {
        email,
        password,
      },
    },
    ({ email, password }) => {
      cy.get('#email').type(email, {
        log: false,
      });
      cy.get('#password').type(password, {
        log: false,
      });
      cy.get('#next').click();
    }
  )

  // Ensure Microsoft has redirected us back to the sample app with our logged in user.
  cy.url().should('equals', Cypress.config('baseUrl') + '/metering-point/search');
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session(
    `b2c-${email}`,
    () => {
      const log = Cypress.log({
        displayName: 'B2C Login',
        message: [`🔐 Authenticating | ${email}`],
        autoEnd: false,
      });

      console.log('base url', Cypress.config('baseUrl'));

      log.snapshot('before');

      loginViaB2C(email, password);

      log.snapshot('after');
      log.end();
    },
    {
      validate: () => {
        cy.visit(Cypress.config('baseUrl'));
        cy.get('h1').contains(daTranslations.meteringPoint.search.title);
      },
    }
  );
});
