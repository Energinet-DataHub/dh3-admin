import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { EoLandingPageShellComponent } from '@energinet-datahub/eo/landing-page/shell';

const bootstrap = () => bootstrapApplication(EoLandingPageShellComponent, config);

export default bootstrap;
