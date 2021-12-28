import { Component, NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DhChargesDataAccessApiStore } from '@energinet-datahub/dh/charges/data-access-api';
import { ChargeLinkDto } from '@energinet-datahub/dh/shared/data-access-api';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { dhMeteringPointIdParam } from '../..';

@Component({
  selector: 'dh-charges',
  templateUrl: './dh-charges.component.html',
  styleUrls: ['./dh-charges.component.scss'],
  providers: [DhChargesDataAccessApiStore],
})
export class DhChargesComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  meteringPointId$ = this.route.params.pipe(
    map((params) => params[dhMeteringPointIdParam] as string)
  );

  constructor(
    private route: ActivatedRoute,
    private store: DhChargesDataAccessApiStore) {
      this.loadChargesData();
    }

  tariffs$: Observable<Array<ChargeLinkDto>> = this.store.tariffs$;
  subscriptions$: Observable<Array<ChargeLinkDto>> = this.store.subscriptions$;
  fees$: Observable<Array<ChargeLinkDto>> = this.store.fees$;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  loadChargesData(): void {
    this.meteringPointId$
      .pipe(
        takeUntil(this.destroy$),
        map((meteringPointId) =>
          this.store.loadChargesData(meteringPointId)
        )
      )
      .subscribe();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [DhChargesComponent],
  exports: [DhChargesComponent],
})
export class DhChargesComponentModule {}
