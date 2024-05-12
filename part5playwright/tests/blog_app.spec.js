const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

test('login can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByRole('button', { name: 'log in' }).click()

  await expect(page.getByTestId('username')).toBeVisible()
  await expect(page.getByTestId('password')).toBeVisible()
  
  
})

