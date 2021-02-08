import React, { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('a new note...')

  const handleChange = (e) => {
    setNewNote(e.target.value)
  }

  const addNote = (e) => {
    e.preventDefault()
    createNote({
      content: newNote,
      data: new Date().toISOString(),
      // important: Math.random() < 0.5,
      important: false
    })
    setNewNote('')
  }

  return (
    <div className='formDiv'>
      <h2>Create new Note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
        />
        <button type='submit'>save</button>
      </form>
    </div>
  )
}

export default NoteForm