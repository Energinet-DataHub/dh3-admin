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
import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AsyncValidatorFn,
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import {
  of,
  ReplaySubject,
  Subject,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs';

import { WattDropdownOptions } from './watt-dropdown-option';
import { WattDropdownValue } from './watt-dropdown-value';

const MAX_DISTANCE_FROM_SCREEN_LEFT_EDGE = 60;

@Component({
  selector: 'watt-dropdown',
  templateUrl: './watt-dropdown.component.html',
  styleUrls: ['./watt-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WattDropdownComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  /**
   * @ignore
   */
  private destroy$ = new Subject<void>();
  /**
   * @ignore
   */
  private parentControl?: FormControl;
  /**
   * @ignore
   */
  private validateParent?: ValidatorFn;
  /**
   * @ignore
   */
  private validateParentAsync?: AsyncValidatorFn;

  /**
   * @ignore
   */
  matSelectControl = new FormControl(null, { updateOn: 'blur' });

  /**
   * Control for the MatSelect filter keyword
   *
   * @ignore
   */
  filterControl = new FormControl();

  /**
   * List of options filtered by search keyword
   *
   * @ignore
   */
  filteredOptions = new ReplaySubject<WattDropdownOptions>(1);

  /**
   * @ignore
   */
  @ViewChild('matSelect', { static: true }) matSelect?: MatSelect;

  /**
   *
   * Sets the options for the dropdown.
   */
  @Input() options: WattDropdownOptions = [];

  /**
   * Sets support for selecting multiple dropdown options.
   */
  @Input() multiple = false;

  /**
   * Sets the placeholder for the dropdown.
   */
  @Input() placeholder = '';

  /**
   * Label to be shown when no options are found after filtering.
   *
   * Note: The label is visible in "multiple" mode only.
   */
  @Input() noOptionsFoundLabel = '';

  constructor(@Host() private parentControlDirective: NgControl) {
    this.parentControlDirective.valueAccessor = this;
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
    // load the initial list of options
    this.filteredOptions.next(this.options.slice());

    this.listenForFilterFieldValueChanges();
    this.initializePropertiesFromParent();
    this.bindParentValidatorsToControl();
    this.bindControlToParent();
  }

  /**
   * @ignore
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @ignore
   */
  writeValue(value: WattDropdownValue): void {
    this.matSelectControl.setValue(value);
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattDropdownValue) => void): void {
    this.changeParentValue = onChangeFn;
  }

  /**
   * @ignore
   */
  registerOnTouched(onTouchFn: () => void) {
    this.markParentControlAsTouched = onTouchFn;
  }

  /**
   * @ignore
   */
  setDisabledState(shouldDisable: boolean): void {
    if (shouldDisable) {
      this.matSelectControl.disable();
    } else {
      this.matSelectControl.enable();
    }
  }

  /**
   * If the dropdown is in "multiple" mode and close to the screen's left edge,
   * Angular Material positions the dropdown panel slightly to the right
   * causing alignment issues to our custom positionning.
   *
   * This function tries to figure out whether the dropdown is positioned bellow
   * a specific threshold from the screen's left edge
   *
   * @ignore
   */
  get isCloseToScreenLeftEdge(): boolean {
    if (this.multiple) {
      const triggerPosition: DOMRect | undefined =
        this.matSelect?.trigger?.nativeElement?.getBoundingClientRect();

      if (
        triggerPosition &&
        triggerPosition.left <= MAX_DISTANCE_FROM_SCREEN_LEFT_EDGE
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * @ignore
   */
  private listenForFilterFieldValueChanges() {
    this.filterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.filterOptions());
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattDropdownValue): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  private markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   *
   * Store the parent control, its validators and async validators in properties
   * of this component.
   */
  private initializePropertiesFromParent(): void {
    this.parentControl = this.parentControlDirective.control as FormControl;

    this.validateParent =
      (this.parentControl.validator &&
        this.parentControl.validator.bind(this.parentControl)) ||
      (() => null);

    this.validateParentAsync =
      (this.parentControl.asyncValidator &&
        this.parentControl.asyncValidator.bind(this.parentControl)) ||
      (() => of(null));
  }

  /**
   * @ignore
   *
   * Inherit validators from parent form control.
   */
  private bindParentValidatorsToControl(): void {
    const validators = !this.matSelectControl.validator
      ? [this.validateParent]
      : Array.isArray(this.matSelectControl.validator)
      ? [...this.matSelectControl.validator, this.validateParent]
      : [this.matSelectControl.validator, this.validateParent];
    this.matSelectControl.setValidators(validators);

    const asyncValidators = !this.matSelectControl.asyncValidator
      ? [this.validateParentAsync]
      : Array.isArray(this.matSelectControl.asyncValidator)
      ? [...this.matSelectControl.asyncValidator, this.validateParentAsync]
      : [this.matSelectControl.asyncValidator, this.validateParentAsync];
    this.matSelectControl.setAsyncValidators(asyncValidators);

    this.matSelectControl.updateValueAndValidity();
  }

  /**
   * @ignore
   *
   * Emit values to the parent form control when our form control's value
   * changes.
   *
   * Reflect parent validation errors in our form control.
   */
  private bindControlToParent(): void {
    this.matSelectControl.valueChanges
      .pipe(
        map((value) => (value === undefined ? null : value)),
        map((value: WattDropdownValue) => {
          if (Array.isArray(value) && value.length === 0) {
            return null;
          }

          return value;
        }),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: WattDropdownValue) => {
        this.markParentControlAsTouched();
        this.changeParentValue(value);
      });

    this.parentControl?.statusChanges
      .pipe(
        map(
          () =>
            ({
              ...this.parentControl?.errors,
            } as ValidationErrors)
        ),
        map((errors) => (Object.keys(errors).length > 0 ? errors : null)),
        takeUntil(this.destroy$)
      )
      .subscribe((errors) => {
        this.matSelectControl.setErrors(errors);
      });
  }

  /**
   * @ignore
   */
  private filterOptions() {
    if (!this.options) {
      return;
    }

    // get the search keyword
    let search = (this.filterControl.value as string).trim();

    if (search) {
      search = search.toLowerCase();
    } else {
      return this.filteredOptions.next(this.options.slice());
    }

    // filter the options
    this.filteredOptions.next(
      this.options.filter(
        (option) => option.displayValue.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
