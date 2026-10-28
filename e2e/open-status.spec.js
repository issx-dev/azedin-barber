import { test, expect } from '@playwright/test';

// Live open/closed status (src/scripts/open-status.js), shown in "Dónde" and
// in the footer "Hoy" block. Times are written with their real Madrid offset:
// late October/November is CET (+01:00), summer is CEST (+02:00).

const status = (page) => page.locator('#donde [data-open-status]');
const footerStatus = (page) => page.locator('footer [data-hoy-status]');

async function at(page, iso) {
  await page.clock.setFixedTime(new Date(iso));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.locator('#donde').scrollIntoViewIfNeeded();
}

test.describe('Open status — Europe/Madrid', () => {
  test('Tuesday 11:00 is open until 14:00, with the open dot and today marked', async ({ page }) => {
    await at(page, '2026-10-27T11:00:00+01:00');
    await expect(status(page)).toBeVisible();
    await expect(status(page)).toHaveText('Abierto ahora · hasta las 14:00');
    await expect(footerStatus(page)).toHaveText('Abierto ahora · hasta las 14:00');
    await expect(page.locator('#donde [data-open-dot]')).toHaveClass(/bg-salvia/);
    await expect(page.locator('footer [data-hoy-day]')).toHaveText('Martes · 10:00 – 14:00 · 16:00 – 20:00');

    const today = page.locator('#donde [data-today]');
    await expect(today).toHaveCount(1);
    await expect(today).toHaveAttribute('data-day', 'Martes');
  });

  test('Tuesday 13:45 says it closes at 14:00', async ({ page }) => {
    await at(page, '2026-10-27T13:45:00+01:00');
    await expect(status(page)).toHaveText('Abierto · cierra a las 14:00');
  });

  test('Tuesday 15:00 is closed and opens at 16:00, with a neutral dot', async ({ page }) => {
    await at(page, '2026-10-27T15:00:00+01:00');
    await expect(status(page)).toHaveText('Cerrado · abre a las 16:00');
    await expect(page.locator('#donde [data-open-dot]')).toHaveClass(/bg-humo/);
    await expect(page.locator('#donde [data-open-dot]')).not.toHaveClass(/bg-salvia/);
  });

  test('Sunday 12:00 is closed and opens tomorrow (Monday) at 16:00', async ({ page }) => {
    await at(page, '2026-11-01T12:00:00+01:00');
    await expect(status(page)).toHaveText('Cerrado · abre mañana a las 16:00');
    await expect(page.locator('#donde [data-today]')).toHaveAttribute('data-day', 'Domingo');
    await expect(page.locator('footer [data-hoy-day]')).toHaveText('Domingo · Cerrado');
  });

  test('Saturday 21:00 skips Sunday and opens on Monday afternoon', async ({ page }) => {
    await at(page, '2026-10-31T21:00:00+01:00');
    await expect(status(page)).toHaveText('Cerrado · abre el lunes a las 16:00');
    await expect(footerStatus(page)).toHaveText('Cerrado · abre el lunes a las 16:00');
  });

  test('summer time (CEST, +02:00): Tuesday 10:00 is open', async ({ page }) => {
    await at(page, '2026-07-14T10:00:00+02:00');
    await expect(status(page)).toHaveText('Abierto ahora · hasta las 14:00');
  });

  test('the status refreshes as the minutes pass', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-27T13:29:00+01:00') });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(status(page)).toHaveText('Abierto ahora · hasta las 14:00');
    // fastForward jumps and fires due timers once; runFor would step every rAF frame.
    await page.clock.fastForward('02:00');
    await expect(status(page)).toHaveText('Abierto · cierra a las 14:00');
  });
});

test.describe('Open status — visitor in another time zone', () => {
  test.use({ timezoneId: 'America/New_York' });

  test('uses Madrid time, not the browser time zone', async ({ page }) => {
    // 11:00 in Berja is 06:00 in New York: a machine-tz bug would say "Cerrado".
    await at(page, '2026-10-27T11:00:00+01:00');
    expect(await page.evaluate(() => new Date().getHours())).toBe(6);
    await expect(status(page)).toHaveText('Abierto ahora · hasta las 14:00');
    await expect(page.locator('#donde [data-today]')).toHaveAttribute('data-day', 'Martes');
  });
});

test.describe('Open status — no JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows no status, only the weekly hours', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(status(page)).toBeHidden();
    await expect(page.locator('#donde [data-today]')).toHaveCount(0);
    await expect(page.locator('#donde dt')).toHaveCount(7);
    await expect(footerStatus(page)).toHaveText('Consulta el horario semanal');
    await expect(page.locator('footer [data-hoy-dot]')).toBeHidden();
  });
});
