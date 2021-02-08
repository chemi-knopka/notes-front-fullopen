import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NoteForm from './NoteForm'

test('<NoteForm /> updated its parent state and calls Submit', () => {
    const mockCreateNote = jest.fn()

    const component = render(
        <NoteForm createNote={mockCreateNote} />
    )

    const input = component.container.querySelector('input')
    const form = component.container.querySelector('form')

    fireEvent.change(input, {
        target: {value: 'testing note submition and addition'}
    })
    fireEvent.submit(form)

    expect(mockCreateNote.mock.calls).toHaveLength(1)
    expect(mockCreateNote.mock.calls[0][0].content).toBe('testing note submition and addition')
})