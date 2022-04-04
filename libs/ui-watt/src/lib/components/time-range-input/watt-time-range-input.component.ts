import {
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {
  combineLatest,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { MatDateRangeInput } from '@angular/material/datepicker';
import Inputmask from 'inputmask';

export type WattTimeRange = { start: string; end: string };

/**
 * Note: The reason for using upper case `MM` is because
 * `Inputmask` package uses upper case `MM` for "minutes" and
 * lower case `mm` for "months".
 * This is opposite of what most other date libraries do.
 */
const hoursMinutesFormat = 'HH:MM';
const hoursMinutesPlaceholder = 'HH:mm';

/**
 * Usage:
 * `import { WattTimeRangeInputModule } from '@energinet-datahub/watt';`
 */
@Component({
  selector: 'watt-time-range-input',
  templateUrl: './watt-time-range-input.component.html',
  styleUrls: ['./watt-time-range-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WattTimeRangeInputComponent
  implements AfterViewInit, ControlValueAccessor, OnDestroy
{
  /**
   * @ignore
   */
  @ViewChild(MatDateRangeInput)
  matDateRangeInput!: MatDateRangeInput<unknown>;

  /**
   * @ignore
   */
  @ViewChild('startTime')
  startTimeInput!: ElementRef;

  /**
   * @ignore
   */
  @ViewChild('endTime')
  endTimeInput!: ElementRef;

  /**
   * @ignore
   */
  placeholder = hoursMinutesPlaceholder;

  /**
   * @ignore
   */
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private renderer: Renderer2,
    @Host() private parentControlDirective: NgControl
  ) {
    this.parentControlDirective.valueAccessor = this;
  }

  /**
   * @ignore
   */
  ngAfterViewInit() {
    const onInputStart$ = this.mask(this.startTimeInput, 'start');
    const onInputEnd$ = this.mask(this.endTimeInput, 'end');

    combineLatest([onInputStart$, onInputEnd$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([startTime, endTime]) => {
        this.markParentControlAsTouched();
        this.changeParentValue({ start: startTime, end: endTime });
      });
  }

  /**
   * @ignore
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * @ignore
   */
  writeValue(timeRange: WattTimeRange): void {
    const inputEvent = new Event('input', { bubbles: true });

    if (timeRange.start) {
      this.startTimeInput.nativeElement.value = timeRange.start;
      this.startTimeInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (timeRange.end) {
      this.startTimeInput.nativeElement.value = timeRange.end;
      this.startTimeInput.nativeElement.dispatchEvent(inputEvent);
    }
  }

  /**
   * @ignore
   */
  registerOnChange(onChangeFn: (value: WattTimeRange) => void): void {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private changeParentValue = (value: WattTimeRange): void => {
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
   */
  private mask(
    element: ElementRef,
    position: 'start' | 'end'
  ): Observable<string> {
    this.renderer.setAttribute(element.nativeElement, 'spellcheck', 'false');

    const maskingElement = this.appendMaskElement(element);

    const inputmask = new Inputmask('datetime', {
      inputFormat: hoursMinutesFormat,
      placeholder: this.placeholder,
      onincomplete: () => {
        maskingElement.innerHTML = this.placeholder;
      },
      jitMasking: true,
      clearIncomplete: true,
      onKeyDown: (event) => {
        // If start date is complete jump to end date, and put typed value in end date (if empty)
        if (
          event.key !== 'Backspace' &&
          position === 'start' &&
          inputmask.isComplete()
        ) {
          this.endTimeInput.nativeElement.focus();

          if (this.endTimeInput.nativeElement.value === '') {
            this.endTimeInput.nativeElement.value = event.key;
          }
        }
      },
    }).mask(element.nativeElement);

    return this.registerOnInput(element.nativeElement, inputmask);
  }

  /**
   * @ignore
   */
  private registerOnInput(
    element: HTMLInputElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputMask: any
  ): Observable<string> {
    return fromEvent(element, 'input').pipe(
      startWith(element.value),
      map(() => element.value),
      map((value) => (inputMask.isComplete() ? value : '')),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
  }

  /**
   * @ignore
   */
  private appendMaskElement(element: ElementRef): HTMLElement {
    const maskingElement = this.renderer.createElement('span');

    this.renderer.addClass(maskingElement, 'watt-time-range-mask');
    this.renderer.insertBefore(
      element.nativeElement.parentElement,
      maskingElement,
      element.nativeElement
    );
    maskingElement.innerHTML = this.placeholder;

    fromEvent(element.nativeElement, 'input')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateMaskElementValue(
          maskingElement,
          element.nativeElement.value
        );
      });

    return maskingElement;
  }

  /**
   * @ignore
   */
  private updateMaskElementValue(
    maskingElement: HTMLElement,
    value: string
  ): void {
    maskingElement.innerText = value + this.placeholder.substring(value.length);
  }
}
