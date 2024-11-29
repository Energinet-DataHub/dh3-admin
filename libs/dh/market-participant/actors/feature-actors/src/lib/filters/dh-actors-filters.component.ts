import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  input,
  OnInit,
  inject,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@ngneat/transloco';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WattButtonComponent } from '@energinet-datahub/watt/button';
import { WattDropdownComponent } from '@energinet-datahub/watt/dropdown';
import { ActorStatus, EicFunction } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  DhDropdownTranslatorDirective,
  dhEnumToWattDropdownOptions,
  dhMakeFormControl,
} from '@energinet-datahub/dh/shared/ui-util';
import { VaterSpacerComponent, VaterStackComponent } from '@energinet-datahub/watt/vater';
import { WattQueryParamsDirective } from '@energinet-datahub/watt/directives';

import { ActorsFilters } from '../actors-filters';

type Form = FormGroup<{
  actorStatus: FormControl<ActorsFilters['actorStatus']>;
  marketRoles: FormControl<ActorsFilters['marketRoles']>;
}>;

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,

    VaterSpacerComponent,
    VaterStackComponent,
    WattButtonComponent,
    WattDropdownComponent,
    WattQueryParamsDirective,

    DhDropdownTranslatorDirective,
  ],
  selector: 'dh-actors-filters',
  styles: [
    `
      :host {
        display: block;
      }

      form {
        overflow-y: hidden;
      }
    `,
  ],
  template: `
    <form
      vater-stack
      direction="row"
      gap="s"
      tabindex="-1"
      [formGroup]="formGroup"
      wattQueryParams
      *transloco="let t; read: 'marketParticipant.actorsOverview.filters'"
    >
      <watt-dropdown
        dhDropdownTranslator
        translateKey="marketParticipant.actorsOverview.status"
        [formControl]="formGroup.controls.actorStatus"
        [options]="actorStatusOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('status')"
      />

      <watt-dropdown
        dhDropdownTranslator
        translateKey="marketParticipant.marketRoles"
        [formControl]="formGroup.controls.marketRoles"
        [options]="marketRolesOptions"
        [multiple]="true"
        [chipMode]="true"
        [placeholder]="t('marketRole')"
      />

      <vater-spacer />
      <watt-button variant="text" icon="undo" type="reset" (click)="formReset.emit()">
        {{ t('reset') }}
      </watt-button>
    </form>
  `,
})
export class DhActorsFiltersComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  initial = input.required<ActorsFilters>();

  filter = output<ActorsFilters>();
  formReset = output<void>();

  formGroup!: Form;

  actorStatusOptions = dhEnumToWattDropdownOptions(ActorStatus, [
    ActorStatus.New,
    ActorStatus.Passive,
  ]);

  marketRolesOptions = dhEnumToWattDropdownOptions(EicFunction);

  ngOnInit() {
    this.formGroup = new FormGroup({
      actorStatus: dhMakeFormControl<ActorStatus[]>(this.initial().actorStatus),
      marketRoles: dhMakeFormControl<EicFunction[]>(this.initial().marketRoles),
    });

    this.formGroup.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.filter.emit(value as ActorsFilters));
  }
}
