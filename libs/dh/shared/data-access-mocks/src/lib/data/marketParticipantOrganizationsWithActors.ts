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
/* eslint-disable sonarjs/no-duplicate-string */
import { MarketParticipantOrganizationWithActorsDto } from '@energinet-datahub/dh/shared/domain';

export const marketParticipantOrganizationsWithActors: MarketParticipantOrganizationWithActorsDto[] =
  [
    {
      organization: {
        organizationId: '8623ef18-3dec-40aa-2b6f-08db0db39b5f',
        name: '1006 mjm',
        businessRegisterIdentifier: '12345674',
        domain: 'DA9B2C41-69B2-4035-B7E3-3F4C64A6034F.dk',
        status: 'New',
        address: {
          streetName: null,
          number: null,
          zipCode: null,
          city: null,
          country: 'DK',
        },
      },
      actors: [],
    },
    {
      organization: {
        organizationId: 'a7d3a4d2-385d-4205-c86f-08db0aa90a13',
        name: '1007 mjm',
        businessRegisterIdentifier: '12345672',
        domain: 'F3B04ECF-EF3F.dk',
        status: 'New',
        address: {
          streetName: null,
          number: null,
          zipCode: null,
          city: null,
          country: 'DK',
        },
      },
      actors: [],
    },
    {
      organization: {
        organizationId: 'a7f3b4d8-5e41-4bb0-1e86-08db0b50f68a',
        name: '1008 mjm',
        businessRegisterIdentifier: '12345673',
        domain: 'C4599587-6B0D.dk',
        status: 'New',
        address: {
          streetName: null,
          number: null,
          zipCode: null,
          city: null,
          country: 'DK',
        },
      },
      actors: [],
    },
    {
      organization: {
        organizationId: '8c2d7c35-f504-4c76-818f-08db0aa84a8c',
        name: '1009 mjm',
        businessRegisterIdentifier: '12345671',
        domain: '1A1E4E32-7758-4EDA-B2A5-D9BF78DE6A0A.dk',
        status: 'New',
        address: {
          streetName: null,
          number: null,
          zipCode: null,
          city: null,
          country: 'DK',
        },
      },
      actors: [],
    },
    {
      organization: {
        organizationId: 'fb0ae095-11ba-41a6-1be4-08dac88f0fff',
        name: '1a1a1a2a',
        businessRegisterIdentifier: '32145698',
        domain: 'fake-domain-b77c9f73-75de-4408-9457-b0970eb0c5b4.dk',
        status: 'New',
        address: {
          streetName: null,
          number: null,
          zipCode: null,
          city: null,
          country: 'DK',
        },
      },
      actors: [],
    },
    {
      organization: {
        organizationId: 'b3bdd441-4f22-4f84-b88f-08da5f288474',
        name: '97 MJM',
        businessRegisterIdentifier: '344434',
        domain: 'fake-domain-16010d98-64fb-4961-aa3e-c94967e72a6e.dk',
        status: 'Deleted',
        address: {
          streetName: null,
          number: null,
          zipCode: null,
          city: null,
          country: 'DK',
        },
      },
      actors: [
        {
          actorId: 'efad0fee-9d7c-49c6-7c17-08da5f28ddb1',
          organizationId: 'b3bdd441-4f22-4f84-b88f-08da5f288474',
          actorNumber: { value: '9561643029441' },
          status: 'Active',
          name: { value: 'Navn Ændret' },
          marketRoles: [
            {
              eicFunction: 'BalanceResponsibleParty',
              gridAreas: [
                {
                  id: '2f8197d5-05a7-4f68-957c-73d95d1c9289',
                  meteringPointTypes: ['D01VeProduction'],
                },
                {
                  id: '31e25acd-7a93-4740-b5c6-e931785d5d38',
                  meteringPointTypes: [
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D18OtherProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D11NetToGrid',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D05NetProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                  ],
                },
                {
                  id: 'c5ee11ed-1d93-439d-8c6d-fabf993c7a3c',
                  meteringPointTypes: [
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                  ],
                },
                {
                  id: 'b128c1d9-1519-4d85-b675-38ae69d02206',
                  meteringPointTypes: [
                    'Unknown',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D20ExchangeReactiveEnergy',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                    'D12TotalConsumption',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D06SupplyToGrid',
                  ],
                },
                {
                  id: '2aa10797-d52e-4d02-9a17-f52860fb94b8',
                  meteringPointTypes: [
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'Unknown',
                    'D01VeProduction',
                  ],
                },
                {
                  id: '68e96f9b-5349-4a85-8d0e-c5fa4ba9299c',
                  meteringPointTypes: [
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'E18Production',
                    'E20Exchange',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                  ],
                },
                {
                  id: 'be4dd3fa-b91e-4539-9868-0eaa1a0e4728',
                  meteringPointTypes: [
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'E20Exchange',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                  ],
                },
                {
                  id: '47381d20-a583-45a4-836b-636c43603179',
                  meteringPointTypes: [
                    'D18OtherProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D11NetToGrid',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D05NetProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                  ],
                },
              ],
              comment: '1234',
            },
            {
              eicFunction: 'DataHubAdministrator',
              gridAreas: [
                {
                  id: '47381d20-a583-45a4-836b-636c43603179',
                  meteringPointTypes: [
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                  ],
                },
              ],
              comment: '123',
            },
          ],
        },
        {
          actorId: 'ccbc4dab-1c14-49af-7c18-08da5f28ddb1',
          organizationId: 'b3bdd441-4f22-4f84-b88f-08da5f288474',
          actorNumber: { value: '9561643029441' },
          status: 'Inactive',
          name: { value: '12341312' },
          marketRoles: [
            {
              eicFunction: 'MeteringPointAdministrator',
              gridAreas: [
                {
                  id: 'c5ee11ed-1d93-439d-8c6d-fabf993c7a3c',
                  meteringPointTypes: [
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                  ],
                },
              ],
              comment: '',
            },
            {
              eicFunction: 'EnergySupplier',
              gridAreas: [
                {
                  id: 'da78b887-a080-476d-864a-8cecc0be663c',
                  meteringPointTypes: [
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                  ],
                },
              ],
              comment: 'tester',
            },
          ],
        },
        {
          actorId: '44ff3dc4-d4f0-4620-8ed8-cade66efccee',
          organizationId: 'b3bdd441-4f22-4f84-b88f-08da5f288474',
          actorNumber: { value: '11X0-0000-0544-U' },
          status: 'New',
          name: { value: '' },
          marketRoles: [
            {
              eicFunction: 'BalanceResponsibleParty',
              gridAreas: [
                {
                  id: 'c5ee11ed-1d93-439d-8c6d-fabf993c7a3c',
                  meteringPointTypes: [
                    'D20ExchangeReactiveEnergy',
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D12TotalConsumption',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D06SupplyToGrid',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                    'Unknown',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                  ],
                },
                {
                  id: '31e25acd-7a93-4740-b5c6-e931785d5d38',
                  meteringPointTypes: [
                    'D99InternalUse',
                    'E17Consumption',
                    'E18Production',
                    'E20Exchange',
                    'D13NetLossCorrection',
                    'D14ElectricalHeating',
                    'D15NetConsumption',
                    'D17OtherConsumption',
                    'D18OtherProduction',
                    'D20ExchangeReactiveEnergy',
                    'D07ConsumptionFromGrid',
                    'D08WholeSaleServicesInformation',
                    'D09OwnProduction',
                    'D10NetFromGrid',
                    'D11NetToGrid',
                    'D12TotalConsumption',
                    'D01VeProduction',
                    'D02Analysis',
                    'D03NotUsed',
                    'D04SurplusProductionGroup6',
                    'D05NetProduction',
                    'D06SupplyToGrid',
                    'Unknown',
                  ],
                },
              ],
              comment: 'test1, test2',
            },
          ],
        },
      ],
    },
  ];
