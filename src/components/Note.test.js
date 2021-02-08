
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'content is for jest testing',
    importtant: true
  }

  const component = render(
    <Note note={note}/>
  )

  const li = component.container.querySelector('li')
  console.log(prettyDOM(li))

  // method 1
  expect(component.container).toHaveTextContent(
    'content is for jest testing'
  )

  const element = component.getByText(
    'content is for jest testing'
  )
  expect(element).toBeDefined()


  // method 3
  const div = component.container.querySelector('.note')
  expect(div).toHaveTextContent(
    'content is for jest testing'
  )
})


test('clicking the button calls event handler only once', () => {
  const note = {
    content: 'testing event handler',
    important: true
  }

  const mockHandler = jest.fn()

  const component = render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const button = component.getByText('make unimportant')
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})