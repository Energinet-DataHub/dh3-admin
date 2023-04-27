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
import { exec } from 'child_process';
import inquirer from 'inquirer';

exec(`git branch`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'branch',
        message: 'Make PR to:',
        choices: [
          'main',
          new inquirer.Separator(),
          ...stdout
            .split('\n')
            .map((branch) => branch.trim())
            .filter((branch) => branch !== '' && branch !== 'main'),
        ],
      },
    ])
    .then((answers) => {
      exec(`gh pr create --base "${answers.branch}" --web`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }

        console.log(stdout);
      });
    });
});
