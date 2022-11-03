import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { createPopper } from '@popperjs/core/lib/popper-lite.js';
import { Platform } from '@angular/cdk/platform';

import { wattTooltipPosition } from './watt-tooltip.directive';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, takeUntil } from 'rxjs';

type unlistenerFunction = () => void;

@Component({
  template: `
    {{ text }}
    <div id="arrow" data-popper-arrow></div>
  `,
  selector: 'watt-tooltip',
  standalone: true,
  styleUrls: ['./watt-tooltip.component.scss'],
})
export class WattTooltipComponent implements AfterViewInit, OnDestroy {
  static nextId = 0;

  @Input() text!: string;
  @Input() target!: HTMLElement;
  @Input() position!: wattTooltipPosition;

  @ViewChild('arrow') arrow!: ElementRef<HTMLElement>;

  @HostBinding() id = `watt-tooltip-${WattTooltipComponent.nextId++}`; // used by aria-describedby
  @HostBinding('attr.role') role = 'tooltip';

  private element: HTMLElement = inject(ElementRef).nativeElement;
  private platform = inject(Platform);
  private renderer: Renderer2 = inject(Renderer2);
  private focusMonitor: FocusMonitor = inject(FocusMonitor);

  /** Emits when the component is destroyed. */
  private readonly destroyed = new Subject<void>();
  private listeners: unlistenerFunction[] = [];
  private showClass = 'show';

  ngAfterViewInit(): void {
    console.log(this.arrow);
    createPopper(this.target, this.element, {
      placement: this.position,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [10, 20],
          },
        },
      ],
    });

    this.setupEventListeners();

    this.focusMonitor
    .monitor(this.target, true)
    .pipe(takeUntil(this.destroyed))
    .subscribe(origin => {
      if (!origin) {
        this.hide();
      } else if (origin === 'keyboard') {
        this.show();
      }
    });
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listener) => listener());
    this.destroyed.next();
    this.destroyed.complete();
  }

  private setupEventListeners(): void {
    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (this.platformSupportsMouseEvents()) {
      const mouseEnter = this.renderer.listen(
        this.target,
        'mouseenter',
        this.show.bind(this)
      );
      const mouseLeave = this.renderer.listen(
        this.target,
        'mouseleave',
        this.hide.bind(this)
      );
      const wheel = this.renderer.listen(
        this.target,
        'wheel',
        this.hide.bind(this)
      );
      this.listeners.push(mouseEnter, mouseLeave, wheel);
    } else {
      const touchStart = this.renderer.listen(
        this.target,
        'touchstart',
        this.show.bind(this)
      );
      const touchEnd = this.renderer.listen(
        this.target,
        'touchend',
        this.hide.bind(this)
      );
      const touchCancel = this.renderer.listen(
        this.target,
        'touchcancel',
        this.hide.bind(this)
      );
      this.listeners.push(touchStart, touchEnd, touchCancel);
    }
  }

  private show(): void {
    this.renderer.addClass(this.element, this.showClass);
  }

  private hide(): void {
    this.renderer.removeClass(this.element, this.showClass);
  }

  private platformSupportsMouseEvents() {
    return !this.platform.IOS && !this.platform.ANDROID;
  }
}
