// The 3D steps of Grade 6 Unit 1, with real taps and drags on the canvas.
const {test, expect} = require('./fixtures');

const SHAPES = ['Triangular prism', 'Square pyramid', 'Pentagonal prism', 'Hexagonal pyramid'];
const TOTAL = {faces: [5, 5, 7, 7], edges: [9, 8, 15, 12], vertices: [6, 5, 10, 7]};
const targets = view => view.evaluate(el => el.polyView.targets());

// Count every face (edge, vertex) of each shape with the buttons a student has: tap each one you can reach, turn the shape all
// the way around, then tilt it to see the bottom and turn it again, until all are counted.
for (const [step, kind] of [[2, 'faces'], [3, 'edges'], [4, 'vertices']]) {
  test(`Polyhedra: tap to count the ${kind}`, async ({page, tap}) => {
    await page.goto(`grade6/unit1/learn/polyhedra.html#s${step}`);
    const view = page.locator('#widget [data-st]'), readout = page.locator('#widget .readout');
    for (const [i, name] of SHAPES.entries()) {
      await page.getByRole('button', {name, exact: true}).click();
      await view.locator('canvas').scrollIntoViewIfNeeded();
      await expect(readout).toContainText(`0 ${kind}`);
      for (let turn = 0; turn < 32 && !(await targets(view)).every(t => t.counted); turn++) {
        for (const t of (await targets(view)).filter(t => t.tappable && !t.counted)) {
          const before = (await targets(view)).filter(u => u.counted).length;
          await tap(t.x, t.y);
          const after = await targets(view);
          expect(after.find(u => u.id === t.id).counted, `${name}: tapping ${kind} ${t.id} at (${t.x | 0}, ${t.y | 0}) counts it`).toBe(true);
          expect(after.filter(u => u.counted).length, `${name}: one tap counts one`).toBe(before + 1);
        }
        if (turn === 15) for (let k = 0; k < 3; k++) await page.getByRole('button', {name: 'Tilt to see the bottom'}).click();
        else await page.getByRole('button', {name: 'Turn right'}).click();
      }
      await expect(readout).toContainText(`All ${TOTAL[kind][i]} ${kind}`);
    }
  });
}

test('Polyhedra: a second tap uncounts, a drag turns without counting, and Start over clears', async ({page, tap}) => {
  await page.goto('grade6/unit1/learn/polyhedra.html#s2');
  const view = page.locator('#widget [data-st]'), readout = page.locator('#widget .readout'), canvas = view.locator('canvas');
  await canvas.scrollIntoViewIfNeeded();
  await expect(readout).toContainText('0 faces');
  const start = await targets(view), t = start.find(t => t.tappable);
  await tap(t.x, t.y);
  await expect(readout).toContainText('1 face counted');
  await tap(t.x, t.y);
  await expect(readout).toContainText('0 faces');
  // a drag across the canvas turns the shape (the faces move) and counts nothing
  const box = await canvas.boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.move(cx - 60, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 60, cy, {steps: 8});
  await page.mouse.up();
  await expect(readout).toContainText('0 faces');
  expect((await targets(view)).map(u => Math.round(u.x)), 'the faces moved').not.toEqual(start.map(u => Math.round(u.x)));
  await tap(t.x, t.y);
  await page.getByRole('button', {name: 'Start over'}).click();
  await expect(readout).toContainText('0 faces');
});

// Phone fingers need room: every edge and vertex target is at least 44 pixels across.
test('Polyhedra: edge and vertex targets are big enough to tap', async ({page}) => {
  for (const [step, kind] of [[3, 'edges'], [4, 'vertices']]) {
    await page.goto(`grade6/unit1/learn/polyhedra.html#s${step}`);
    const view = page.locator('#widget [data-st]');
    for (const name of SHAPES) {
      await page.getByRole('button', {name, exact: true}).click();
      await view.locator('canvas').waitFor();
      const small = Math.min(...(await targets(view)).map(t => t.r));
      expect(2 * small, `${name}: the smallest ${kind} target, in pixels across`).toBeGreaterThanOrEqual(44);
    }
  }
});

// Cube nets: predict yes for each one, fold it, and the page says whether it made a cube.
test('Nets: every cube net folds (or doesn’t) as it should', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('grade6/unit1/learn/nets.html#s4');
  const cube = [true, false, true, false, true, true], res = page.locator('#widget [data-res]');
  for (const [i, ok] of cube.entries()) {
    await page.locator(`#widget .thumb[data-i="${i}"]`).click();
    await page.getByRole('button', {name: 'Yes, a cube'}).click();
    await page.getByRole('button', {name: 'Fold it'}).click();
    await expect(res).toContainText(ok ? 'It folds into a cube' : 'It doesn’t fold into a cube');
    await expect(res).toContainText(ok ? 'You predicted it!' : 'Surprise!');
  }
});

test('Prisms and pyramids: the stepper and kind buttons rebuild the shape', async ({page}) => {
  await page.goto('grade6/unit1/learn/prisms-and-pyramids.html#s1');
  const readout = page.locator('#widget .readout');
  await expect(readout).toContainText('pentagonal prism');
  await page.getByRole('button', {name: 'Sides on the base: one more'}).click();
  await expect(readout).toContainText('hexagonal prism');
  await expect(readout).toContainText('Edges: 6 + 6 + 6 = 18');
  await page.getByRole('button', {name: 'Pyramid', exact: true}).click();
  await expect(readout).toContainText('hexagonal pyramid');
  await expect(readout).toContainText('Vertices: 6 + 1 = 7');
});
