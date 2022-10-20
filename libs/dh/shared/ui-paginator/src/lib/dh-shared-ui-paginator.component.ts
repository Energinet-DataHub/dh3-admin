import { Component, OnDestroy, inject, ViewChild, Input } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'dh-shared-ui-paginator',
  imports: [MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="length"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      [showFirstLastButtons]="true"
      [attr.aria-label]="ariaLabel"
    >
    </mat-paginator>
  `,
})
export class DhSharedUiPaginatorComponent implements OnDestroy {
  @ViewChild(MatPaginator, { static: true }) instance!: MatPaginator;

  @Input() length = 0;
  @Input() pageSizeOptions: number[] = [50, 100, 150, 200, 250];
  @Input() pageSize = 50;

  ariaLabel?: string;

  private matPaginatorIntl = inject(MatPaginatorIntl);
  private translocoService = inject(TranslocoService);
  private destroy$ = new Subject<void>();

  constructor() {
    this.translocoService
      .selectTranslateObject('shared.paginator')
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.setTranslations(x));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setTranslations(translations: any) {
    this.ariaLabel = translations.ariaLabel;
    this.matPaginatorIntl.itemsPerPageLabel = translations.itemsPerPageLabel;
    this.matPaginatorIntl.nextPageLabel = translations.next;
    this.matPaginatorIntl.previousPageLabel = translations.previous;
    this.matPaginatorIntl.firstPageLabel = translations.first;
    this.matPaginatorIntl.lastPageLabel = translations.last;
    this.matPaginatorIntl.getRangeLabel = this.getRangeLabel(translations.of);
    this.matPaginatorIntl.changes.next();
  }

  private getRangeLabel(seperator: string) {
    return (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) {
        return `0 ${seperator} ${length}`;
      }

      length = Math.max(length, 0);

      const startIndex = page * pageSize;

      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;

      return `${startIndex + 1} – ${endIndex} ${seperator} ${length}`;
    };
  }
}
