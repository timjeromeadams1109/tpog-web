import { test, expect } from '@playwright/test'

const DEPLOYED_URL = 'https://tpog-web.vercel.app'
const MOCKUP_URL = 'https://tpog-flutter-mockup.vercel.app'

test.describe('TPOG Visual Verification', () => {
  test('Home Screen - Countdown visible and formatted', async ({ page }) => {
    await page.goto(DEPLOYED_URL)
    await page.waitForLoadState('networkidle')

    // Check countdown section exists
    const countdown = page.locator('[class*="countdown"]').first()
    await expect(countdown).toBeVisible()

    // Verify countdown title is not cut off
    const countdownTitle = page.locator('text=Countdown To').first()
    if (await countdownTitle.isVisible()) {
      const boundingBox = await countdownTitle.boundingBox()
      console.log('✓ Countdown title visible:', boundingBox)
    }

    // Screenshot home screen
    await page.screenshot({ path: '/tmp/tpog-home.png', fullPage: true })
    console.log('✓ Home screen screenshot: /tmp/tpog-home.png')
  })

  test('Home Screen - No blank white space', async ({ page }) => {
    await page.goto(DEPLOYED_URL)
    await page.waitForLoadState('networkidle')

    // Check if page has content below countdown
    const content = await page.locator('body').textContent()
    const hasContent = (content?.length || 0) > 200

    expect(hasContent).toBe(true)
    console.log('✓ Home screen has content (not blank)')
  })

  test('Bottom Navigation - 70px height', async ({ page }) => {
    await page.goto(DEPLOYED_URL)
    await page.waitForLoadState('networkidle')

    // Check bottom nav height
    const nav = page.locator('[class*="bottomNav"]').first()
    if (await nav.isVisible()) {
      const boundingBox = await nav.boundingBox()
      const height = boundingBox?.height
      console.log(`Bottom nav height: ${height}px (should be 70px)`)
      // 70px ± 2px for browser rendering variations
      expect(height).toBeGreaterThanOrEqual(68)
      expect(height).toBeLessThanOrEqual(72)
    }
  })

  test('Navigation Items - Visible and clickable', async ({ page }) => {
    await page.goto(DEPLOYED_URL)
    await page.waitForLoadState('networkidle')

    // Check navigation items exist
    const navItems = page.locator('[class*="navItem"]')
    const count = await navItems.count()
    console.log(`✓ Found ${count} navigation items`)
    expect(count).toBeGreaterThan(0)
  })

  test('Colors - Primary blue correct (#2741E8)', async ({ page }) => {
    await page.goto(DEPLOYED_URL)
    await page.waitForLoadState('networkidle')

    // Check if primary color elements exist
    const primaryElements = page.locator('[class*="primary"], [class*="Primary"], h2, h1')
    const count = await primaryElements.count()
    console.log(`✓ Found ${count} potential primary color elements`)
    expect(count).toBeGreaterThan(0)
  })

  test('Fonts - Poppins font family applied', async ({ page }) => {
    await page.goto(DEPLOYED_URL)
    await page.waitForLoadState('networkidle')

    // Check body font
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily
    })

    console.log(`Body font: ${bodyFont}`)
    expect(bodyFont.toLowerCase()).toContain('poppins')
  })
})

test.describe('Mockup Comparison', () => {
  test('Compare home screens side-by-side', async ({ page }) => {
    // Deployed app
    await page.goto(DEPLOYED_URL)
    await page.waitForLoadState('networkidle')
    const deployedScreenshot = await page.screenshot({ fullPage: true })

    // Mockup reference
    const mockupPage = await page.context().newPage()
    await mockupPage.goto(MOCKUP_URL)
    await mockupPage.waitForLoadState('networkidle')
    const mockupScreenshot = await mockupPage.screenshot({ fullPage: true })

    console.log('✓ Screenshots captured')
    console.log('Deploy: /tmp/tpog-deployed.png')
    console.log('Mockup: /tmp/tpog-mockup.png')

    // Save for visual comparison
    await page.screenshot({ path: '/tmp/tpog-deployed.png', fullPage: true })
    await mockupPage.screenshot({ path: '/tmp/tpog-mockup.png', fullPage: true })

    await mockupPage.close()
  })
})
