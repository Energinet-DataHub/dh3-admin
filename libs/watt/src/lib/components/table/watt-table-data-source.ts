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
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface IWattTableDataSource<T> extends DataSource<T> {
  data: T[];
  filter: string;
  filteredData: T[];
  paginator: MatPaginator | null;
  sort: MatSort | null;
  // TODO: Type this properly?
  filterPredicate: MatTableDataSource<T>['filterPredicate'];
  sortData: MatTableDataSource<T>['sortData'];
  sortingDataAccessor: MatTableDataSource<T>['sortingDataAccessor'];
}

/**
 * @see https://material.angular.io/components/table/api#MatTableDataSource
 */
// TODO: Do we still need WattTableDataSource?
export class WattTableDataSource<T> extends DataSource<T> implements IWattTableDataSource<T> {
  private dataSource = new MatTableDataSource<T>();

  constructor(
    data?: T[],
    config: { disableClientSideSort: boolean } = { disableClientSideSort: false }
  ) {
    super();
    if (data) this.dataSource.data = data;

    if (config.disableClientSideSort)
      this.sortData = (data: T[]): T[] => {
        return data;
      };
  }

  get data() {
    return this.dataSource.data;
  }
  set data(data: T[]) {
    this.dataSource.data = data;
  }

  get filter() {
    return this.dataSource.filter;
  }
  set filter(filter: string) {
    this.dataSource.filter = filter;
  }

  get filteredData() {
    return this.dataSource.filteredData;
  }
  set filteredData(filteredData: T[]) {
    this.dataSource.filteredData = filteredData;
  }

  get paginator() {
    return this.dataSource.paginator;
  }
  set paginator(paginator) {
    this.dataSource.paginator = paginator;
  }

  get sort() {
    return this.dataSource.sort;
  }
  set sort(sort) {
    this.dataSource.sort = sort;
  }

  get filterPredicate() {
    return this.dataSource.filterPredicate;
  }
  set filterPredicate(filterPredicate) {
    this.dataSource.filterPredicate = filterPredicate;
  }

  get sortData() {
    return this.dataSource.sortData;
  }
  set sortData(sortData) {
    this.dataSource.sortData = sortData;
  }

  get sortingDataAccessor() {
    return this.dataSource.sortingDataAccessor;
  }
  set sortingDataAccessor(sortingDataAccessor) {
    this.dataSource.sortingDataAccessor = sortingDataAccessor;
  }

  connect() {
    return this.dataSource.connect();
  }

  disconnect() {
    this.dataSource.disconnect();
  }
}
