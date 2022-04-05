import {
  compareSortValues,
  getRowToExpand,
  wrapInTableRow,
} from './dh-table-util';

describe(wrapInTableRow.name, () => {
  it('should wrap in table row', () => {
    const data: string[] = ['Test data'];

    const wrappedTableRow = wrapInTableRow<string>(data);

    expect(wrappedTableRow.length).toBe(1);
    expect(wrappedTableRow[0].data).toBe(data[0]);
  });
});

describe(getRowToExpand.name, () => {
  it('should return row to expand', async () => {
    document.body.innerHTML = `
      <div>
        <mat-row>
          <div id='process-row' class='mat-row'>
            <div class='column'></div><div class='column'></div>
          </div>
        </mat-row>
        <mat-row>
          <div id='detail-row' class='mat-row'>
            <div class='column'></div><div class='column'></div>
          </div>
        </mat-row>
      </div>
    `;
    const firstRow = document.getElementById('process-row');
    const firstColumnOfFirstRow = firstRow?.children[0];

    if (firstColumnOfFirstRow === undefined) {
      // This is purely to satisfy the linter complaining about a possible undefined value
      throw new Error('Expected to find table cell element');
    }

    const rowToExpand = getRowToExpand(firstColumnOfFirstRow);

    expect(rowToExpand?.children[0].id).toBe('detail-row');
  });
});

describe(compareSortValues.name, () => {
  it('should return the expected sorting values', async () => {
    const oneIsSmallerThanTwoDesc = compareSortValues(1, 2, false);
    const oneIsSmallerThanTwoAsc = compareSortValues(1, 2, true);
    const oneIsEqualToOne = compareSortValues(1, 1, true);

    const aIsSmallerThanBDesc = compareSortValues('a', 'b', false);
    const aIsSmallerThanBAsc = compareSortValues('a', 'b', true);

    expect(oneIsSmallerThanTwoDesc).toBe(1);
    expect(oneIsSmallerThanTwoAsc).toBe(-1);
    expect(oneIsEqualToOne).toBe(1);

    expect(aIsSmallerThanBDesc).toBe(1);
    expect(aIsSmallerThanBAsc).toBe(-1);
  });
});
