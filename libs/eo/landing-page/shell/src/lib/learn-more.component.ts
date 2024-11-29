import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@ngneat/transloco';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WATT_MODAL, WattModalComponent } from '@energinet-datahub/watt/modal';
import { WattDropdownComponent, WattDropdownOption } from '@energinet-datahub/watt/dropdown';

import { translations } from '@energinet-datahub/eo/translations';
import { EoVimeoPlayerComponent } from '@energinet-datahub/eo/shared/components/ui-vimeo-player';

@Component({
  standalone: true,
  selector: 'eo-learn-more',
  imports: [
    WattButtonComponent,
    WATT_MODAL,
    TranslocoPipe,
    WattDropdownComponent,
    ReactiveFormsModule,
    EoVimeoPlayerComponent,
  ],
  styles: `
    .eo-learn-more-modal {
      --watt-modal-content-padding: 0;

      .watt-modal {
        grid-template-rows: auto;
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content />

    @if (isOpen()) {
      <watt-modal
        #modal
        size="small"
        [loading]="isLoading()"
        (closed)="onClosed()"
        [hideCloseButton]="true"
        [panelClass]="['eo-learn-more-modal']"
      >
        <eo-vimeo-player
          poster="assets/images/vimeo-video-poster.png"
          video="https://player.vimeo.com/video/642352286?h=91e1a8b63c&badge=0&autopause=0&player_id=0&app_id=58479"
        />
      </watt-modal>
    }
  `,
})
export class EoLearnMoreComponent implements OnInit {
  @ViewChild(WattModalComponent) modal!: WattModalComponent;

  @HostListener('click')
  onClick() {
    this.isOpen.set(true);
    this.cd.detectChanges();
    this.modal.open();
  }

  protected language = new FormControl();

  protected translations = translations;
  protected isOpen = signal<boolean>(false);
  protected isLoading = signal<boolean>(true);

  protected languages!: WattDropdownOption[];

  private transloco = inject(TranslocoService);
  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isLoading.set(false);
      });
  }

  onClosed() {
    this.isOpen.set(false);
  }
}
