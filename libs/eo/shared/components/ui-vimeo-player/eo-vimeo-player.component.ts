import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  SecurityContext,
  inject,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Player from '@vimeo/player';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf],
  selector: 'eo-vimeo-player',
  styles: [
    `
      :host {
        display: block;

        position: relative;
        overflow: hidden;

        max-width: 100%;
        height: 0;
        padding-bottom: 56.25%;

        // Lazy-loaded Vimeo iframe
        ::ng-deep iframe {
          position: absolute;
          top: 0;
          left: 0;

          border: 0;
          width: 100%;
          height: 100%;
        }
      }

      .poster-image {
        width: 100%;

        cursor: pointer;
      }
    `,
  ],
  template: `
    <img *ngIf="isPosterVisible" class="poster-image" [src]="poster" (click)="onVideoPlay()" />
  `,
})
export class EoVimeoPlayerComponent {
  private sanitizer = inject(DomSanitizer);
  private changeDetector = inject(ChangeDetectorRef);
  private hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  #safePosterUrl = '';
  #safeVideoUrl: string | null = null;

  @Input()
  set poster(url: string | null) {
    if (url === null) {
      return;
    }

    const maybePosterUrl = (this.#safeVideoUrl = this.sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(url)
    ));

    if (maybePosterUrl === null) {
      console.error(`The specified Vimeo poster URL is unsafe: "${url}"`);

      return;
    }

    this.#safePosterUrl = maybePosterUrl;
  }
  get poster(): string {
    return this.#safePosterUrl;
  }
  @Input()
  set video(url: string | null) {
    if (url === null) {
      return;
    }

    this.#safeVideoUrl = this.sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(url)
    );
  }

  isPosterVisible = true;

  async onVideoPlay(): Promise<void> {
    if (this.#safeVideoUrl === null) {
      console.error(`The specified Vimeo video URL is unsafe: "${this.video}"`);

      return;
    }

    const vimeoPlayer = new Player(this.hostElement.nativeElement, {
      url: this.#safeVideoUrl,
    });

    await vimeoPlayer.ready();

    this.isPosterVisible = false;
    // Manual change detection required because the video player isn't ready
    // until some tick later than when this event handler was triggered
    this.changeDetector.detectChanges();
    vimeoPlayer.play();
  }
}
