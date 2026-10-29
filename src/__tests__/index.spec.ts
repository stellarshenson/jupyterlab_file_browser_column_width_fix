/**
 * Guards that the DirListing patch is installed and that its wrappers act on a
 * stale cached width. The real @jupyterlab/filebrowser is replaced because it
 * pulls untransformed ESM through @jupyter/react-components.
 */
jest.mock('@jupyterlab/filebrowser', () => ({
  DirListing: class {
    _updateColumnSizes(): void {
      // replaced by the test's spy
    }
    _setColumnSize(): void {
      // replaced by the test's spy
    }
    _saveState(): void {
      // replaced by the test's spy
    }
  }
}));

import { DirListing } from '@jupyterlab/filebrowser';

import { patchDirListing } from '../index';

interface IFakeListing {
  node: { getBoundingClientRect(): { width: number } };
  _width: number | null;
  _paddingWidth: number;
  _contentScrollbarWidth: number;
  _columnSizes: Record<string, number | null>;
  _updateColumnSizes(): void;
  _setColumnSize(name: string, size: number): void;
  _saveState(): void;
}

/**
 * A listing whose node measures 300 px: the live content width is
 * 300 - 2 * 12 - 17 = 259.
 */
function fakeListing(): IFakeListing {
  const proto = DirListing.prototype as any;
  return {
    node: { getBoundingClientRect: () => ({ width: 300 }) },
    _width: 24,
    _paddingWidth: 12,
    _contentScrollbarWidth: 17,
    _columnSizes: { name: 24, is_selected: 18, last_modified: -48 },
    _updateColumnSizes: proto._updateColumnSizes,
    _setColumnSize: proto._setColumnSize,
    _saveState: proto._saveState
  };
}

describe('patchDirListing', () => {
  const proto = DirListing.prototype as any;
  const stockUpdate = jest.spyOn(proto, '_updateColumnSizes');
  const stockSet = jest.spyOn(proto, '_setColumnSize');
  const stockSave = jest.spyOn(proto, '_saveState');

  beforeAll(() => {
    expect(patchDirListing('4.6.4')).toBe(true);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is installed only once', () => {
    expect(patchDirListing('4.6.4')).toBe(false);
  });

  it('replaces a stale cached width on update', () => {
    const listing = fakeListing();
    listing._updateColumnSizes();
    expect(listing._width).toBe(259);
    expect(stockUpdate).toHaveBeenCalledTimes(1);
  });

  it('replaces a stale cached width on a divider resize', () => {
    const listing = fakeListing();
    listing._setColumnSize('name', 120);
    expect(listing._width).toBe(259);
    expect(stockSet).toHaveBeenCalledWith('name', 120);
  });

  it('leaves a healthy cached width alone', () => {
    const listing = fakeListing();
    listing._width = 200;
    listing._updateColumnSizes();
    expect(listing._width).toBe(200);
  });

  it('sanitises negative and collapsed sizes before saving', () => {
    const listing = fakeListing();
    listing._saveState();
    expect(listing._columnSizes.is_selected as number).toBeGreaterThanOrEqual(
      18
    );
    expect(listing._columnSizes.last_modified as number).toBeGreaterThanOrEqual(
      60
    );
    expect(listing._columnSizes.name as number).toBeGreaterThan(60);
    expect(stockSave).toHaveBeenCalledTimes(1);
  });
});
