import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

/*
test('clicking the button calls event handler once', async () => {

  const blog = {
    title: 'Async is cool testing testing',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 323,

  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} toggleDetails={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('Show Details')
  await user.click(button)

  console.log(mockHandler.mock.calls, '--------------------------')

  expect(mockHandler.mock.calls).toHaveLength(1)
})*/

test('renders content', () => {

  const blog = {
    title: 'Async is cool testing testing',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 323,
    //user: savedUser.body.id
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Async is cool testing testing')
  expect(element).toBeDefined()
})

test('renders only title', () => {

  const blog = {
    title: 'Async is cool testing testing',
    author: 'Testi',
    url: 'www.Async.fi',
    likes: 323,
    //user: savedUser.body.id
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Async is cool testing testing')
  expect(element).toBeDefined()
})

