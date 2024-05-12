const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

test('login can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByRole('button', { name: 'log in' }).click()

  await expect(page.getByTestId('username')).toBeVisible()
  await expect(page.getByTestId('password')).toBeVisible()
  
  
})

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'anton',
        username: 'antto',
        password: 'salainen'
      }
    })

    await page.goto('')
  })


  test('user can login with correct credentials', async ({ page }) => {
    await loginWith(page, 'antto', 'salainen')
  
    await expect(page.getByText('anton logged in')).toBeVisible()
  })

  
  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'antto', 'wrong')

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('Wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    await expect(page.getByText('anton logged in')).not.toBeVisible()
  })  

  
})