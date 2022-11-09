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
import { CommonModule, KeyValue } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  inject,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { WattResizeObserverDirective } from '../../utils/resize-observer';
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
    MatSortModule,
    MatTableModule,
    WattResizeObserverDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'watt-table',
  styleUrls: ['./watt-table.component.scss'],
  templateUrl: './watt-table.component.html',
})
export class WattTableComponent<T> implements OnChanges, AfterViewInit {
  element = inject<ElementRef<HTMLElement>>(ElementRef);

  @ContentChildren(WattTableCellDirective)
  cells = new QueryList<WattTableCellDirective<T>>();

  @ViewChild(MatSort)
  sort!: MatSort;

  @Input()
  dataSource!: WattTableDataSource<T>;

  @Input()
  columns: WattTableColumnDef<T> = {};

  @Input()
  sortActive = '';

  @Input()
  sortDirection: SortDirection = '';

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    const parentSortingDataAccessor = this.dataSource.sortingDataAccessor;
    this.dataSource.sortingDataAccessor = (data: T, sortHeaderId: string) => {
      const value = (data as unknown as Record<string, unknown>)[sortHeaderId];
      return typeof value === 'string'
        ? value.toLowerCase()
        : parentSortingDataAccessor(data, sortHeaderId);
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columns) {
      const sizing = Object.keys(this.columns)
        .map((key) => this.columns[key].size)
        .map((size) => size ?? 'auto');

      this.element.nativeElement.style.setProperty(
        '--watt-table-grid-template-columns',
        sizing.join(' ')
      );
    }
  }

  _getColumns() {
    return Object.keys(this.columns);
  }

  _getColumnTemplate(column: WattTableColumn<T>) {
    const cell = this.cells.find((item) => item.column === column);
    return cell
      ? cell.templateRef
      : this.cells.find((item) => !item.column)?.templateRef;
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
      return '-';
    }
  }
}
