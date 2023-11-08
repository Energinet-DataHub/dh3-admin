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
import { Injectable } from '@angular/core';
import { combineLatest, fromEvent, map, Observable, tap } from 'rxjs';
import { WattMaskedInput } from './watt-input-mask.service';

export interface WattRangeInputConfig {
  startInput: {
    element: HTMLInputElement;
    maskedInput: WattMaskedInput;
  };
  endInput: {
    element: HTMLInputElement;
    maskedInput: WattMaskedInput;
  };
}

export interface WattRangeInputConfigV2 {
  startInput: {
    element: HTMLInputElement;
  };
  endInput: {
    element: HTMLInputElement;
  };
  placeholder: string;
}

@Injectable()
export class WattRangeInputService {
  onInputChanges$?: Observable<[string, string]>;

  init(config: WattRangeInputConfig) {
    const { startInput, endInput } = config;
    const { maskedInput: startMaskedInput } = startInput;
    const { maskedInput: endMaskedInput } = endInput;

    const onStartInputChange$ = startMaskedInput.onChange$.pipe(
      tap((value: string) => {
        this.jumpToEndInput(
          value,
          startMaskedInput.inputMask,
          startInput.element,
          endInput.element
        );
      })
    );

    this.onInputChanges$ = combineLatest([onStartInputChange$, endMaskedInput.onChange$]);
  }

  private jumpToEndInput(
    value: string,
    inputmask: Inputmask.Instance,
    startInputElement: HTMLInputElement,
    endInputElement: HTMLInputElement
  ) {
    if (document.activeElement !== startInputElement) return;

    if (value.length === inputmask.getemptymask().length) {
      endInputElement.focus();
      endInputElement.setSelectionRange(0, 0);
    }
  }

  initV2(config: WattRangeInputConfigV2) {
    const { startInput, endInput } = config;

    const onStartInputChange$ = fromEvent<InputEvent>(startInput.element, 'input').pipe(
      map((event) => (event?.target as HTMLInputElement).value),
      tap((value: string) => {
        this.jumpToEndInputV2(
          value,
          startInput.element,
          endInput.element,
          config.placeholder,
        );
      })
    );

    this.onInputChanges$ = combineLatest([onStartInputChange$, fromEvent<InputEvent>(endInput.element, 'input').pipe(
      map((event) => (event?.target as HTMLInputElement).value))]);
  }

  private jumpToEndInputV2(
    value: string,
    startInputElement: HTMLInputElement,
    endInputElement: HTMLInputElement,
    placeholder: string
  ) {
    if (document.activeElement !== startInputElement) return;

    if (value.length === placeholder.length) {
      endInputElement.focus();
      endInputElement.setSelectionRange(0, 0);
    }
  }
}
