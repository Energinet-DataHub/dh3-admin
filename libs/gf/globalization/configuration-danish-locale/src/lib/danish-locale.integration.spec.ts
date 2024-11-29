import { TestBed } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe, DecimalPipe, PercentPipe } from '@angular/common';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { spaceToNonBreakingSpace } from './space-to-non-breaking-space';
import { danishLocaleProvider } from './danish-locale.provider';
import { danishCurrencyProvider } from './danish-currency.provider';
import { danishLocaleInitializer } from './danish-locale.initializer';

dayjs.extend(utc);
dayjs.extend(timezone);

describe('Danish locale', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [danishLocaleProvider, danishLocaleInitializer, danishCurrencyProvider],
    });
  });

  it('configures the DecimalPipe', () => {
    @Component({
      template: "{{ value() | number: '1.1' }}",
      standalone: true,
      imports: [DecimalPipe],
    })
    class TestHostComponent {
      value = input(123456789);
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    expect(hostElement.textContent).toBe('123.456.789,0');
  });

  it('configures the CurrencyPipe', () => {
    @Component({
      template: "{{ value() | currency: undefined: 'code' }}",
      standalone: true,
      imports: [CurrencyPipe],
    })
    class TestHostComponent {
      value = input(1234.56);
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    expect(hostElement.textContent).toEqual(spaceToNonBreakingSpace(`1.234,56 DKK`));
  });

  it('configures the PercentPipe', () => {
    @Component({
      template: "{{ value() | percent:'4.3-5' }}",
      standalone: true,
      imports: [PercentPipe],
    })
    class TestHostComponent {
      value = input(1.3495);
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    expect(hostElement.textContent).toBe(spaceToNonBreakingSpace(`0.134,950 %`));
  });

  it('configures the DatePipe', () => {
    const testDate = new Date('2020-05-24T08:00:00Z');

    @Component({
      template: "{{ value() | date: 'medium' }}",
      standalone: true,
      imports: [DatePipe],
    })
    class TestHostComponent {
      value = input(testDate);
    }

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.autoDetectChanges(true);
    const hostElement = hostFixture.nativeElement;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const hourAndMinutesInCurrentTimeZone = dayjs(testDate).tz(timeZone).format('HH.mm');
    const dayInCurrentTimeZone = dayjs(testDate).tz(timeZone).format('D');

    expect(hostElement.textContent).toBe(
      `${dayInCurrentTimeZone}. maj 2020 ${hourAndMinutesInCurrentTimeZone}.00`
    );
  });
});
