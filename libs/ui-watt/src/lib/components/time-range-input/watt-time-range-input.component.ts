import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
  startWith,
  Subject,
  takeUntil,
  tap,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  initialValue?: WattTimeRange;

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
    const startTimeInputElement = this.startTimeInput.nativeElement;
    const endTimeInputElement = this.endTimeInput.nativeElement;

    const startTimeInputMask = this.mask(startTimeInputElement);
    const endTimeInputMask = this.mask(endTimeInputElement);

    if (this.initialValue) {
      this.writeValue(this.initialValue);
    }

    this.setInputColor(startTimeInputElement, startTimeInputMask);
    this.setInputColor(endTimeInputElement, startTimeInputMask);

    const startTimeOnInput$ = fromEvent<InputEvent>(
      startTimeInputElement,
      'input'
    ).pipe(
      tap(() => this.setInputColor(startTimeInputElement, startTimeInputMask)),
      map((event) => (event.target as HTMLInputElement).value)
    );

    const endTimeOnInput$ = fromEvent<InputEvent>(
      endTimeInputElement,
      'input'
    ).pipe(
      tap(() => this.setInputColor(endTimeInputElement, startTimeInputMask)),
      map((event) => (event.target as HTMLInputElement).value)
    );

    const startDateOnComplete$ = startTimeOnInput$.pipe(
      startWith(this.initialValue?.start ?? ''),
      map((value) => (startTimeInputMask.isComplete() ? value : ''))
    );

    const endDateOnComplete$ = endTimeOnInput$.pipe(
      startWith(this.initialValue?.end ?? ''),
      map((value) => (endTimeInputMask.isComplete() ? value : ''))
    );

    combineLatest([startDateOnComplete$, endDateOnComplete$])
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
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
    if (!this.startTimeInput || !this.endTimeInput) {
      this.initialValue = timeRange;
      return;
    }

    const inputEvent = new Event('input', { bubbles: true });

    if (timeRange.start) {
      this.startTimeInput.nativeElement.value = timeRange.start;
      this.startTimeInput.nativeElement.dispatchEvent(inputEvent);
    }

    if (timeRange.end) {
      this.endTimeInput.nativeElement.value = timeRange.end;
      this.endTimeInput.nativeElement.dispatchEvent(inputEvent);
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
  private mask(element: HTMLInputElement): Inputmask.Instance {
    const inputmask: Inputmask.Instance = new Inputmask('datetime', {
      inputFormat: hoursMinutesFormat,
      placeholder: this.placeholder,
      onincomplete: () => {
        this.setInputColor(element, inputmask);
      },
      insertMode: false,
      insertModeVisual: true,
      clearMaskOnLostFocus: false,
      clearIncomplete: true,
    }).mask(element);

    return inputmask;
  }

  /**
   * @ignore
   */
  private setInputColor(
    inputElement: HTMLInputElement,
    inputMask: Inputmask.Instance
  ) {
    const emptyMask = inputMask.getemptymask();
    const val = inputElement.value;

    const splittedEmptyMask = emptyMask.split('');
    const splittedVal = val.split('');

    const charWidth = 9;
    const gradient = splittedEmptyMask.map((char, index) => {
      const charHasChanged =
        char !== splittedVal[index] && splittedVal[index] !== undefined;
      const color = charHasChanged
        ? 'var(--watt-color-neutral-black)'
        : 'var(--watt-color-neutral-grey-500)';
      const gradientStart =
        index === 0 ? `${charWidth}px` : `${charWidth * index}px`;
      const gradientEnd =
        index === 0 ? `${charWidth}px` : `${charWidth * (index + 1)}px`;

      if (index === 0) {
        return `${color} ${gradientStart},`;
      } else {
        return `${color} ${gradientStart}, ${color} ${gradientEnd}${
          index !== splittedEmptyMask.length - 1 ? ',' : ''
        }`;
      }
    });

    this.renderer.setStyle(
      inputElement,
      'background-image',
      `linear-gradient(90deg, ${gradient.join('')})`
    );
  }
}
