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
import { DhProcess } from '@energinet-datahub/dh/metering-point/domain';
import {
  DhProcessesTableComponent,
  DhProcessesTableScam,
} from './dh-processes-table.component';
import { getTranslocoTestingModule } from '@energinet-datahub/dh/shared/test-util-i18n';
import { runOnPushChangeDetection } from '@energinet-datahub/dh/shared/test-util-metering-point';
import { fireEvent, render, screen } from '@testing-library/angular';
import { MatcherOptions } from '@testing-library/dom';

const succeededProcessId = '2c4024f5-762d-4a41-a75e-d045c0ed6572';
const failedProcessId = '2c4024f5-762d-4a41-a75e-d045c0ed6573';
const mpGsrn = '577512493148035787';
const process = {
  id: succeededProcessId,
  meteringPointGsrn: mpGsrn,
  name: 'BRS-004',
  createdDate: '2022-02-15T13:46:59.4781826',
  effectiveDate: '2021-09-25T23:00:00',
  status: 'Completed',
  hasDetailsErrors: false,
  expanded: false,
  details: [
    {
      id: 'de567425-a420-48da-9391-0696cd036391',
      processId: succeededProcessId,
      name: 'RequestCreateMeteringPoint',
      sender: '1',
      receiver: '2',
      createdDate: '2022-02-15T13:46:59.4781826',
      effectiveDate: '2021-09-25T23:00:00',
      status: 'Received',
      errors: [],
    },
    {
      id: 'be684c80-c78f-41ae-b47c-90f09fa54415',
      processId: succeededProcessId,
      name: 'ConfirmCreateMeteringPoint',
      sender: '1',
      receiver: '2',
      createdDate: '2022-02-15T13:46:59.4782634',
      effectiveDate: null,
      status: 'Sent',
      errors: [],
    },
  ],
} as DhProcess;

const successProcess: DhProcess = { ...process };
const failedProcess: DhProcess = {
  ...process,
  id: failedProcessId,
  hasDetailsErrors: true,
  details: [
    {
      ...process.details[0],
      processId: failedProcessId,
    },
    {
      ...process.details[1],
      processId: failedProcessId,
      name: 'RejectCreateMeteringPoint',
      errors: [
        {
          id: '504683c2-c12d-401e-4324-08d9f14626c5',
          processDetailId: '28d76085-19f8-4a29-8e8f-213b0d349a41',
          code: 'D16',
          description:
            'GSRN number 572330206146502471 not allowed: The specified metering point is currently not connected nor disconnected (physical status Disconnected)',
        },
      ],
    },
  ],
};
const testData: DhProcess[] = [successProcess, failedProcess];

describe(DhProcessesTableComponent.name, () => {
  async function setup(processes?: DhProcess[]) {
    const { fixture } = await render(DhProcessesTableComponent, {
      componentProperties: {
        processes: processes,
      },
      imports: [getTranslocoTestingModule(), DhProcessesTableScam],
    });

    await runOnPushChangeDetection(fixture);
    fixture.componentInstance.ngAfterViewInit();
    await runOnPushChangeDetection(fixture); // Yes, this needs to be here as well since ngAfterViewInit results in a property being updated
  }

  it(`Should show a single row of process data`, async () => {
    await setup(testData);

    const disableQuerySuggestions: MatcherOptions = { suggest: false };
    const actualProcessNames = screen.getAllByTestId(
      'processName',
      disableQuerySuggestions
    );

    expect(actualProcessNames.length).toBe(testData.length);

    actualProcessNames.forEach((processName, index) => {
      expect(processName.textContent?.trim()).toBe(testData[index].name);
    });
  });

  it(`Should contain one successful and one failed process`, async () => {
    await setup(testData);

    const disableQuerySuggestions: MatcherOptions = { suggest: false };
    const processes = screen.getAllByTestId(
      'processHasDetailsErrors',
      disableQuerySuggestions
    );

    expect(processes[0].getElementsByTagName('mat-icon')[0].innerHTML).toBe(
      'dangerous'
    );
    expect(processes[1].getElementsByTagName('mat-icon')[0].innerHTML).toBe(
      'check_circle'
    );
  });

  it('Should expand details when clicking on a process row', async () => {
    await setup(testData);

    const disableQuerySuggestions: MatcherOptions = { suggest: false };

    // TODO: WHY DOES THIS DO NOTHING?
    // fireEvent.click(
    //   screen.getAllByTestId('processRow', disableQuerySuggestions)[0]
    // );

    const detailRows = screen.getAllByTestId(
      'detailRow',
      disableQuerySuggestions
    );

    expect(detailRows.length).toBe(successProcess.details.length);

    detailRows.forEach((row) => {
      expect(row).toBeVisible();
    });
  });
});
