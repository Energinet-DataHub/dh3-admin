import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { Direction, Spacing, Justify, Wrap } from './types';
import { VaterUtilityDirective } from './vater-utility.directive';

@Component({
  selector: 'vater-flex, [vater-flex]',
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: VaterUtilityDirective,
      inputs: ['fill'],
    },
  ],
  standalone: true,
  styles: [
    `
      vater-flex,
      [vater-flex] {
        display: flex;
        line-height: normal;
      }

      vater-flex > *,
      [vater-flex] > * {
        flex: var(--grow) var(--shrink) var(--basis);
      }
    `,
  ],
  template: `<ng-content />`,
})
export class VaterFlexComponent {
  @Input()
  @HostBinding('style.flex-direction')
  direction: Direction = 'column';

  @Input()
  @HostBinding('style.--grow')
  grow = '1';

  @Input()
  @HostBinding('style.--shrink')
  shrink = '1';

  @Input()
  @HostBinding('style.--basis')
  basis = 'auto';

  @Input()
  gap?: Spacing;

  @Input()
  @HostBinding('style.justify-content')
  justify?: Justify;

  @Input()
  @HostBinding('style.flex-wrap')
  wrap?: Wrap = 'nowrap';

  @Input()
  scrollable?: string;

  @Input()
  offset?: Spacing;

  @HostBinding('style.padding')
  get _offset() {
    if (!this.offset) return undefined;
    switch (this.direction) {
      case 'column':
        return `var(--watt-space-${this.offset}) 0`;
      case 'row':
        return `0 var(--watt-space-${this.offset})`;
    }
  }

  @HostBinding('style.gap')
  get _gap() {
    return this.gap ? `var(--watt-space-${this.gap})` : undefined;
  }

  @HostBinding('style.overflow')
  get _overflow() {
    return this.scrollable === '' ? 'auto' : undefined;
  }
}
