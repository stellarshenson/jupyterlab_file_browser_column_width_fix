import { expect, IJupyterLabPageFixture, test } from '@jupyterlab/galata';

const COLUMNS_KEY = 'file-browser-filebrowser:columns';
const NAME_HEADER = '.jp-DirListing-header .jp-id-name';
const ITEM_TEXT = '.jp-DirListing-itemText';

interface IListingSnapshot {
  headerNameWidth: number;
  itemTextWidths: number[];
}

/**
 * Keep the default file browser listing on `window` for the test helpers.
 * Call it after every page load, including `page.reload()`.
 */
async function captureListing(page: IJupyterLabPageFixture): Promise<void> {
  await page.evaluate(() => {
    const app = (window as any).jupyterapp;
    for (const widget of app.shell.widgets('left')) {
      const listing = (widget as any).listing;
      if (listing) {
        (window as any).__listing = listing;
        return;
      }
    }
    throw new Error('FileBrowser listing not found');
  });
}

async function snapshot(
  page: IJupyterLabPageFixture
): Promise<IListingSnapshot> {
  return page.evaluate(
    ({ headerSelector, itemSelector }) => {
      const header = document.querySelector(headerSelector);
      const items = Array.from(document.querySelectorAll(itemSelector));
      return {
        headerNameWidth: header ? header.getBoundingClientRect().width : 0,
        itemTextWidths: items.map(item => item.getBoundingClientRect().width)
      };
    },
    { headerSelector: NAME_HEADER, itemSelector: ITEM_TEXT }
  );
}

async function setCachedWidth(
  page: IJupyterLabPageFixture,
  width: number,
  update: boolean
): Promise<void> {
  await page.evaluate(
    ({ width, update }) => {
      const listing = (window as any).__listing;
      listing._width = width;
      if (update) {
        listing._updateColumnSizes();
      }
    },
    { width, update }
  );
}

/**
 * Reproduce the broken end state: a stale cached width and a Name column
 * collapsed to 24 px. The fix heals that state on its own, so the test renders
 * the collapsed header directly to test the divider against it.
 */
async function collapseNameColumn(
  page: IJupyterLabPageFixture
): Promise<number> {
  return page.evaluate(() => {
    const listing = (window as any).__listing;
    listing._width = 24;
    listing._columnSizes.name = 24;
    listing.headerNode.innerHTML = '';
    listing._renderer.populateHeaderNode(
      listing.headerNode,
      listing.translator,
      listing._hiddenColumns,
      listing._columnSizes,
      listing.sortState
    );
    const header = document.querySelector('.jp-DirListing-header .jp-id-name');
    return header ? header.getBoundingClientRect().width : 0;
  });
}

async function drag(
  page: IJupyterLabPageFixture,
  selector: string,
  deltaX: number
): Promise<void> {
  const handle = page.locator(selector).first();
  const box = await handle.boundingBox();
  if (!box) {
    throw new Error(`No box for ${selector}`);
  }
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + deltaX, y, { steps: 10 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto();
  await page.contents.uploadContent('alpha', 'text', 'alpha.txt');
  await page.contents.uploadContent('beta', 'text', 'beta.txt');
  await page.locator(ITEM_TEXT).first().waitFor();
  await captureListing(page);
});

test('a stale cached width recovers the Name column', async ({ page }) => {
  await setCachedWidth(page, 24, true);

  await expect
    .poll(async () => (await snapshot(page)).headerNameWidth)
    .toBeGreaterThan(24);

  const { itemTextWidths } = await snapshot(page);
  expect(itemTextWidths.length).toBeGreaterThan(0);
  for (const width of itemTextWidths) {
    expect(width).toBeGreaterThan(0);
  }
});

test('the Name divider resizes while the width is stale', async ({ page }) => {
  const before = await collapseNameColumn(page);
  expect(before).toBeLessThan(60);

  await drag(page, '.jp-DirListing-resizeHandle[data-column="name"]', 80);

  await expect
    .poll(async () => (await snapshot(page)).headerNameWidth)
    .toBeGreaterThan(before + 8);
});

test('a healthy layout keeps its column widths', async ({ page }) => {
  await page.evaluate(async key => {
    const listing = (window as any).__listing;
    if (listing._state) {
      await listing._state.remove(key);
    }
  }, COLUMNS_KEY);
  await page.reload();
  await page.locator(ITEM_TEXT).first().waitFor();
  await captureListing(page);

  const before = await snapshot(page);
  expect(before.headerNameWidth).toBeGreaterThan(100);
  expect(before.itemTextWidths.length).toBeGreaterThan(0);
  for (const width of before.itemTextWidths) {
    expect(width).toBeGreaterThan(0);
  }

  await drag(page, '.jp-DirListing-resizeHandle[data-column="name"]', -40);

  await expect
    .poll(async () => (await snapshot(page)).headerNameWidth)
    .toBeLessThan(before.headerNameWidth);
});

test('a saved 24 px Name column heals on load', async ({ page }) => {
  await page.evaluate(
    async ({ key, sizes }) => {
      const listing = (window as any).__listing;
      if (!listing._state) {
        throw new Error('The listing has no state database');
      }
      await listing._state.save(key, {
        sizes,
        sortState: { direction: 'ascending', key: 'name' }
      });
    },
    {
      key: COLUMNS_KEY,
      sizes: { name: 24, is_selected: 18, last_modified: -48 }
    }
  );
  await page.reload();
  await page.locator(ITEM_TEXT).first().waitFor();
  await captureListing(page);

  const { itemTextWidths } = await snapshot(page);
  expect(itemTextWidths.length).toBeGreaterThan(0);
  for (const width of itemTextWidths) {
    expect(width).toBeGreaterThan(0);
  }
});

test('names stay visible at a 250 px sidebar', async ({ page }) => {
  const sidebarWidth = () =>
    page.evaluate(() => {
      const area = document.querySelector('.jp-SideArea[data-side="left"]');
      return area ? area.getBoundingClientRect().width : 0;
    });

  const before = await sidebarWidth();
  await drag(
    page,
    '#jp-main-split-panel > .lm-SplitPanel-handle',
    250 - before
  );

  await expect.poll(sidebarWidth).toBeGreaterThan(200);
  expect(Math.abs((await sidebarWidth()) - 250)).toBeLessThan(15);

  const { headerNameWidth, itemTextWidths } = await snapshot(page);
  expect(headerNameWidth).toBeGreaterThan(24);
  expect(itemTextWidths.length).toBeGreaterThan(0);
  for (const width of itemTextWidths) {
    expect(width).toBeGreaterThan(0);
  }
});
