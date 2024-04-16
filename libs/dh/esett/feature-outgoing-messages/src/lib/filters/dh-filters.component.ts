/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { Observable, Subscription, debounceTime, map } from 'rxjs';
import { RxPush } from '@rx-angular/template/push';
import { Apollo } from 'apollo-angular';

import { WattFormChipDirective } from '@energinet-datahub/watt/field';
import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent, WattDropdownOptions } from '@energinet-datahub/watt/dropdown';
import { WattDateRangeChipComponent } from '@energinet-datahub/watt/datepicker';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { dhMakeFormControl } from '@energinet-datahub/dh/shared/ui-util';
import {
  DocumentStatus,
  EicFunction,
  ExchangeEventCalculationType,
  GetActorsForEicFunctionDocument,
  GetGridAreasDocument,
  TimeSeriesType,
} from '@energinet-datahub/dh/shared/domain/graphql';
import { exists } from '@energinet-datahub/dh/shared/util-operators';
import { DhOutgoingMessagesFilters } from '@energinet-datahub/dh/esett/data-access-outgoing-messages';

// Map query variables type to object of form controls type
type FormControls<T> = { [P in keyof T]: FormControl<T[P] | null> };
type Filters = FormControls<DhOutgoingMessagesFilters>;

@Component({
  standalone: true,
  selector: 'dh-outgoing-messages-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dh-filters.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        overflow-y: hidden;
      }

      watt-dropdown {
        width: auto;
      }
    `,
  ],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    RxPush,

    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDateRangeChipComponent,
    WattFormChipDirective,
    WattDropdownComponent,
  ],
})
export class DhOutgoingMessagesFiltersComponent implements OnInit, OnDestroy {
  private transloco = inject(TranslocoService);
  private apollo = inject(Apollo);
  private subscription: Subscription | null = null;

  @Input() initial?: DhOutgoingMessagesFilters;

  @Output() filter = new EventEmitter<DhOutgoingMessagesFilters>();
  @Output() formReset = new EventEmitter<void>();

  calculationTypeOptions$ = this.getCalculationTypeOptions();
  messageTypeOptions$ = this.getMessageTypeOptions();
  gridAreaOptions$ = this.getGridAreaOptions();
  energySupplierOptions$ = this.getEnergySupplierOptions();
  documentStatusOptions$ = this.getDocumentStatusOptions();

  formGroup!: FormGroup<Filters>;

  ngOnInit(): void {
    this.formGroup = new FormGroup<Filters>({
      calculationTypes: dhMakeFormControl(this.initial?.calculationTypes),
      messageTypes: dhMakeFormControl(this.initial?.messageTypes),
      gridAreas: dhMakeFormControl(this.initial?.gridAreas),
      actorNumber: dhMakeFormControl(this.initial?.actorNumber),
      status: dhMakeFormControl(this.initial?.status),
      period: dhMakeFormControl(this.initial?.period),
      created: dhMakeFormControl(this.initial?.created),
      latestDispatch: dhMakeFormControl(this.initial?.latestDispatch)
    });

    this.subscription = this.formGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => this.filter.emit(value as DhOutgoingMessagesFilters));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
  }

  private getCalculationTypeOptions(): Observable<WattDropdownOptions> {
    return this.transloco
      .selectTranslateObject('eSett.outgoingMessages.shared.calculationType')
      .pipe(
        map((translationObject) =>
          Object.values(ExchangeEventCalculationType).map((type) => ({
            displayValue: translationObject[type],
            value: type,
          }))
        )
      );
  }

  private getEnergySupplierOptions(): Observable<WattDropdownOptions> {
    return this.apollo
      .query({
        query: GetActorsForEicFunctionDocument,
        variables: {
          eicFunctions: [EicFunction.EnergySupplier],
        },
      })
      .pipe(
        map((result) => result.data?.actorsForEicFunction),
        exists(),
        map((actors) =>
          actors.map((actor) => ({
            value: actor.glnOrEicNumber,
            displayValue: `${actor.glnOrEicNumber} • ${actor.name}`,
          }))
        )
      );
  }

  private getMessageTypeOptions(): Observable<WattDropdownOptions> {
    return this.transloco.selectTranslateObject('eSett.outgoingMessages.shared.messageType').pipe(
      map((translationObject) =>
        Object.values(TimeSeriesType).map((type) => ({
          displayValue: translationObject[type],
          value: type,
        }))
      )
    );
  }

  private getGridAreaOptions(): Observable<WattDropdownOptions> {
    return this.apollo.watchQuery({ query: GetGridAreasDocument }).valueChanges.pipe(
      map((result) => result.data?.gridAreas),
      exists(),
      map((gridAreas) =>
        gridAreas.map((gridArea) => ({
          value: gridArea.code,
          displayValue: gridArea.displayName,
        }))
      )
    );
  }

  private getDocumentStatusOptions(): Observable<WattDropdownOptions> {
    return this.transloco
      .selectTranslateObject('eSett.outgoingMessages.shared.documentStatus')
      .pipe(
        map((translationObject) =>
          Object.values(DocumentStatus).map((status) => ({
            displayValue: translationObject[status],
            value: status,
          }))
        )
      );
  }
}
