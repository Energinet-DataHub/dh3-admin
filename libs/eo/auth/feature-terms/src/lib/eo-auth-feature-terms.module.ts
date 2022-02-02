import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  EoAuthFeatureTermsComponent,
  EoAuthFeatureTermsScam,
} from './eo-auth-feature-terms.component';

const routes: Routes = [
  {
    path: '',
    component: EoAuthFeatureTermsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), EoAuthFeatureTermsScam],
})
export class EoAuthFeatureTermsModule {}
