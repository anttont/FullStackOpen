const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'antto', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('author-input').fill('test author')
      await page.getByTestId('title-input').fill('a blog created by and deleted by playwright')
      await page.getByTestId('url-input').fill('.com')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a blog created by and deleted by playwright')).toBeVisible()
    })
  

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'first blog', true)
        await createBlog(page, 'second blog', true)
        await createBlog(page, 'third blog', true)
      })
  
      
    })

    test('a blog can be liked when Show Details is pressed', async ({ page }) => {

      await page.getByTestId('showdetails').first().click();

      const initialLikes = page.getByTestId('likes', el => el.textContent);
    
      await expect(page.getByRole('button', { name: 'Like' })).toBeVisible();
    
      await page.getByRole('button', { name: 'Like' }).click();

      const updatedLikes = page.getByTestId('likes', el => el.textContent);

      const initialLikesCount = parseInt(initialLikes);
      const updatedLikesCount = parseInt(updatedLikes);
    
      expect(updatedLikesCount).toBe(initialLikesCount + 1);
    });

    test('a blog can be deleted by the user who added it', async ({ page }) => {
     
      await page.getByTestId('showdetails').last().click();
    
      await page.getByTestId('delete', { name: 'Delete' }).click();
    
      const dialog = await page.waitForEvent('dialog');
      await dialog.accept();
    
      const blogTitle = 'a blog created by and deleted by playwright';
      await expect(page.getByText(blogTitle)).not.toBeVisible()
    });
    
    
    
    
    
  })  
})