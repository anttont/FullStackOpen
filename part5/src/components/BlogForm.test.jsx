import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const input1 = screen.getByPlaceholderText('Whos the author?')
  const input2 = screen.getByPlaceholderText('Title of the blog?')
  const input3 = screen.getByPlaceholderText('URL to blog')
  const sendButton = screen.getByText('save')

  await user.type(input1, 'testing author...')
  await user.type(input2, 'testing title...')
  await user.type(input3, 'testing URL...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].author).toBe('testing author...')
  expect(createBlog.mock.calls[0][0].title).toBe('testing title...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing URL...')
})