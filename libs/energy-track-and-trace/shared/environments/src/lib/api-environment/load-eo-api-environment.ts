import { EoApiEnvironment } from './ett-api-environment';

export function loadEoApiEnvironment(configurationFilename: string): Promise<EoApiEnvironment> {
  return fetch(`/assets/configuration/${configurationFilename}`).then((response) => response.json());
}
