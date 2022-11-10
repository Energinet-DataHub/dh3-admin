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
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule, KeyValue } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { map, type Subscription } from 'rxjs';
import { WattResizeObserverDirective } from '../../utils/resize-observer';
import { WattCheckboxModule } from '../checkbox';
import { WattTableDataSource } from './watt-table-data-source';

export interface WattTableColumn<T> {
  header: string | ((key: string) => string);
  cell?: (row: T) => string;
  sort?: boolean;
  size?: string;
}

export interface WattTableColumnDef<T> {
  [id: string]: WattTableColumn<T>;
}

interface WattTableCellContext<T> {
  $implicit: T;
}

@Directive({
  standalone: true,
  selector: '[wattTableCell]',
})
export class WattTableCellDirective<T> {
  @Input('wattTableCell')
  column!: WattTableColumn<T>;

  templateRef = inject(TemplateRef<WattTableCellContext<T>>);

  static ngTemplateContextGuard<T>(
    _directive: WattTableCellDirective<T>,
    context: unknown
  ): context is WattTableCellContext<T> {
    return true;
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    WattResizeObserverDirective,
    WattCheckboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-table',
  styleUrls: ['./watt-table.component.scss'],
  templateUrl: './watt-table.component.html',
})
export class WattTableComponent<T>
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input()
  dataSource!: WattTableDataSource<T>;

  @Input()
  columns: WattTableColumnDef<T> = {};

  @Input()
  sortActive = '';

  @Input()
  sortDirection: SortDirection = '';

  @Input()
  selectable = true;

  @Output()
  selectionChange = new EventEmitter<T[]>();

  /** @ignore */
  @ContentChildren(WattTableCellDirective)
  _cells!: QueryList<WattTableCellDirective<T>>;

  /** @ignore */
  @ViewChild(MatSort)
  _sort!: MatSort;

  /** @ignore */
  _selectionModel = new SelectionModel<T>(true, []);

  /** @ignore */
  _checkboxColumn = '__checkboxColumn__';

  /** @ignore */
  _element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** @ignore */
  _subscription!: Subscription;

  ngAfterViewInit() {
    this.dataSource.sort = this._sort;
    this._subscription = this._selectionModel.changed
      .pipe(map(() => this._selectionModel.selected))
      .subscribe((selection) => this.selectionChange.emit(selection));

    // Make sorting by text case insensitive
    const parentSortingDataAccessor = this.dataSource.sortingDataAccessor;
    this.dataSource.sortingDataAccessor = (data: T, sortHeaderId: string) => {
      const value = (data as unknown as Record<string, unknown>)[sortHeaderId];
      return typeof value === 'string'
        ? value.toLowerCase()
        : parentSortingDataAccessor(data, sortHeaderId);
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns || changes.selectable) {
      const sizing = Object.keys(this.columns)
        .map((key) => this.columns[key].size)
        .map((size) => size ?? 'auto');

      // Add space for extra checkbox column
      if (this.selectable) sizing.unshift('var(--watt-space-xl)');

      this._element.nativeElement.style.setProperty(
        '--watt-table-grid-template-columns',
        sizing.join(' ')
      );
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  get _columnSelection() {
    return this.dataSource.filteredData.every((row) =>
      this._selectionModel.isSelected(row)
    );
  }

  set _columnSelection(value) {
    if (value) {
      this._selectionModel.setSelection(...this.dataSource.filteredData);
    } else {
      this._selectionModel.clear();
    }
  }

  _getColumns() {
    const columns = Object.keys(this.columns);
    return this.selectable ? [this._checkboxColumn, ...columns] : columns;
  }

  _getColumnTemplate(column: WattTableColumn<T>) {
    const cell = this._cells.find((item) => item.column === column);
    return cell
      ? cell.templateRef
      : this._cells.find((item) => !item.column)?.templateRef;
  }

  _getColumnHeader(column: KeyValue<string, WattTableColumn<T>>) {
    return typeof column.value.header === 'string'
      ? column.value.header
      : column.value.header(column.key);
  }

  _getColumnCell(column: KeyValue<string, WattTableColumn<T>>, row: T) {
    if (column.value.cell) {
      return column.value.cell(row);
    } else if (column.key in row) {
      return (row as Record<string, unknown>)[column.key];
    } else {
      return '—';
    }
  }
}

export const WATT_TABLE = [WattTableComponent, WattTableCellDirective] as const;
