import {
  COLUMN_MIN_WIDTHS,
  isStaleWidth,
  sanitiseColumnSizes
} from '../columns';

describe('isStaleWidth', () => {
  it('flags a cached width that cannot fit the column minimums', () => {
    expect(isStaleWidth(24, 250)).toBe(true);
    expect(isStaleWidth(140, 250)).toBe(false);
  });

  it('flags a zero, negative or missing cached width', () => {
    expect(isStaleWidth(0, 250)).toBe(true);
    expect(isStaleWidth(-48, 250)).toBe(true);
    expect(isStaleWidth(null, 250)).toBe(true);
  });
});

describe('sanitiseColumnSizes', () => {
  it('leaves a healthy set unchanged', () => {
    const sizes = { name: 149, is_selected: 18, last_modified: 83 };
    expect(sanitiseColumnSizes(sizes, 250)).toEqual(sizes);
  });

  it('sanitises negative and collapsed sizes against the panel width', () => {
    const clean = sanitiseColumnSizes(
      { name: 24, is_selected: 18, last_modified: -48 },
      250
    );
    expect(clean.is_selected).toBeGreaterThanOrEqual(
      COLUMN_MIN_WIDTHS.is_selected
    );
    expect(clean.last_modified).toBeGreaterThanOrEqual(
      COLUMN_MIN_WIDTHS.last_modified
    );
    expect(clean.name).toBeGreaterThan(COLUMN_MIN_WIDTHS.name);
  });

  it('raises a negative width to a valid value', () => {
    const clean = sanitiseColumnSizes(
      { name: 120, is_selected: -5, last_modified: 90 },
      250
    );
    expect(clean.is_selected).toBe(COLUMN_MIN_WIDTHS.is_selected);
  });

  it('raises the minimums even when the panel width is zero', () => {
    expect(
      sanitiseColumnSizes({ name: 24, is_selected: 18, last_modified: -48 }, 0)
    ).toEqual({ name: 60, is_selected: 18, last_modified: 60 });
  });
});
