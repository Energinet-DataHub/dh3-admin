import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { WattInputMaskService } from './watt-input-mask.service';
import { WattPickerValue } from './watt-picker-value';
import { WattRange } from './watt-range';
import { WattRangeInputService } from './watt-range-input.service';

@Directive()
export abstract class WattPickerBase
  implements
    AfterViewInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<WattRange>
{
  /**
   * @ignore
   */
  abstract input: ElementRef;

  /**
   * @ignore
   */
  abstract startInput: ElementRef;

  /**
   * @ignore
   */
  abstract endInput: ElementRef;

  /**
   * @ignore
   */
  static nextId = 0;

  /**
   * @ignore
   */
  initialValue: WattPickerValue = null;

  /**
   * @ignore
   */
  focused = false;

  /**
   * @ignore
   */
  controlType = 'mat-date-range-input'; // We keep the controlType of Material Date Range Input as is, to keep some styling.

  /**
   * @ignore
   */
  stateChanges = new Subject<void>();

  /**
   * @ignore
   */
  protected destroy$: Subject<void> = new Subject();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy?: string;

  /**
   * @ignore
   */
  @HostBinding('id') hostId = this.id;

  /**
   * @ignore
   */
  get placeholder(): string {
    return this._placeholder;
  }

  /**
   * @ignore
   */
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  protected abstract _placeholder: string;

  /**
   * @ignore
   */
  @Input()
  get value(): WattRange | null {
    if (this.ngControl.valid) {
      const {
        value: { start, end },
      } = this.ngControl;
      return { start, end };
    }
    return null;
  }

  /**
   * @ignore
   */
  set value(value: WattPickerValue) {
    const inputNotToBeInTheDocument = !this.range
      ? !this.input
      : !this.startInput;

    if (inputNotToBeInTheDocument) {
      this.initialValue = value;
      return;
    }

    if (!this.range) {
      this.setSingleValue(value as string, this.input.nativeElement);
    } else {
      this.setRangeValue(
        value as WattRange,
        this.startInput.nativeElement,
        this.endInput.nativeElement
      );
    }

    this.stateChanges.next();
  }

  @Input()
  set range(range: boolean) {
    this._range = coerceBooleanProperty(range);
  }
  get range(): boolean {
    return this._range;
  }

  /**
   * @ignore
   */
  private _range = false;

  /**
   * @ignore
   */
  @Input()
  get required(): boolean {
    return this._required;
  }

  /**
   * @ignore
   */
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _required = false;

  /**
   * @ignore
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @ignore
   */
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /**
   * @ignore
   */
  private _disabled = false;

  /**
   * @ignore
   */
  get empty() {
    if (this.range) {
      return !this.ngControl.value?.start && !this.ngControl.value?.end;
    } else {
      return this.ngControl.value?.length === 0;
    }
  }

  /**
   * @ignore
   */
  get errorState(): boolean {
    return !!this.ngControl.invalid && !!this.ngControl.touched;
  }

  /**
   * @ignore
   */
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  constructor(
    public id: string,
    protected inputMaskService: WattInputMaskService,
    protected rangeInputService: WattRangeInputService,
    protected elementRef: ElementRef<HTMLElement>,
    @Optional() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    if (this.initialValue) {
      this.writeValue(this.initialValue);
    }

    this.range ? this.initRangeInput() : this.initSingleInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stateChanges.complete();
  }

  protected abstract initRangeInput(): void;
  protected abstract initSingleInput(): void;

  /**
   * @ignore
   */
  setDescribedByIds(ids: string[]) {
    this.elementRef.nativeElement.setAttribute(
      'aria-describedby',
      ids.join(' ')
    );
  }

  /**
   * @ignore
   */
  onContainerClick() {
    // Intentionally left empty
  }

  /**
   * @ignore
   */
  writeValue(value: WattPickerValue): void {
    this.value = value;
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: string | WattRange) => void): void {
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
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * @ignore
   */
  onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * @ignore
   */
  onFocusOut(event: FocusEvent) {
    if (
      !this.elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.focused = false;
      this.markParentControlAsTouched();
      this.stateChanges.next();
    }
  }

  /**
   * @ignore
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected changeParentValue = (_value: string | WattRange): void => {
    // Intentionally left empty
  };

  /**
   * @ignore
   */
  protected markParentControlAsTouched = (): void => {
    // Intentionally left empty
  };

  private setRangeValue(
    value: WattRange,
    startInput: HTMLInputElement,
    endInput: HTMLInputElement
  ) {
    const { start, end } = value as WattRange;

    if (start) {
      startInput.value = start;
    }

    if (end) {
      endInput.value = end;
    }
  }

  private setSingleValue(value: string, input: HTMLInputElement) {
    input.value = value;
  }
}
