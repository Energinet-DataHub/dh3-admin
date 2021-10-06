import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LetModule } from '@rx-angular/template';
import { render, screen } from '@testing-library/angular';

import { EttBrowserConfigurationModule } from './../../../feature-shell/src/lib/ett-browser-configuration.module';
import { AuthOidcStubModule } from './auth-oidc-stub.service';
import { EttAuthenticationDirective, EttAuthenticationScam } from './ett-authentication-link.directive';

@Component({
  template: 'TestBlankComponent',
})
class TestBlankComponent {}

describe(EttAuthenticationDirective.name, () => {
  beforeEach(async () => {
    await render(
      `
      <ng-container ettAuthenticationLink #link="ettAuthenticationLink">
        <a *rxLet="link.loginUrl$ as loginUrl" [href]="loginUrl">
          Login test
        </a>
      </ng-container>
    `,
      {
        declarations: [TestBlankComponent],
        imports: [
          EttAuthenticationScam,
          EttBrowserConfigurationModule,
          RouterTestingModule,
          LetModule,
          AuthOidcStubModule.withAuthenticationUrl(authenticationUrl),
        ],
      }
    );

    link = await screen.findByRole('link');
  });

  const authenticationUrl = 'https://example.com/test-authentication';
  let link: HTMLAnchorElement;

  it('links to the authentication URL', async () => {
    const actualUrl = new URL(link.href);

    expect(actualUrl.origin + actualUrl.pathname).toBe(authenticationUrl);
  });

  it('returns to dashboard when login is successful', async () => {
    const actualUrl = new URL(link.href);

    expect(actualUrl.searchParams.get('redirect_uri')).toBe(
      'http://localhost/dashboard'
    );
  });
});
