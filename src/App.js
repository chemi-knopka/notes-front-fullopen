/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import noteServices from './services/notes'
import loginService from './services/login'
import Note from './components/Note'
import Notify from './components/Notify'
import LoginForm from './components/login'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

import './index.css'


const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // const [notification, setNotification] = useState('')

  // refference for toggling commponent to share function
  const noteFormRef = useRef()

  // fetch notes from db.json server
  useEffect(() => {
    noteServices
      .getAll()
      .then( initialNote => {
        setNotes(initialNote)
      })
  }, [])

  // get userToken from session storage
  useEffect(() => {
    const noteAppUser = window.localStorage.getItem('loggedNoteappUser')
    if (noteAppUser) {
      const user = JSON.parse(noteAppUser)
      setUser(user)
      noteServices.setToken(user.token)
    }
  }, [])

  // add note to the db.json server
  const addNote = (noteObject) => {
    // togle visibility of note form using refs
    noteFormRef.current.toggleVisibility()

    // axios add post
    noteServices
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })

  }

  const toggleImportance = id => {
    const note = notes.find(note => note.id ===id)
    const changeNote = { ...note, important: !note.important }

    noteServices
      .update(id, changeNote)
      .then (returnedNote => {
        console.log('udpated')
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(err => {
        console.log('error occured', err)
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  // after clicking on login button
  const handleLogin = async (event) => {

    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteServices.setToken(user.token)
      setUser(user)

      setPassword('')
      setUsername('')

    } catch (exception) {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // after clicking on ligin button
  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='login'>
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            password={password}
            username={username}
          />
        </Togglable>
      </div>
    )
  }

  const noteForm = () => {
    return (
      // we add here react ref to make component togglable from child component
      <Togglable buttonLabel='add note' ref={noteFormRef}>
        <NoteForm createNote={addNote} />
      </Togglable>
    )
  }

  const logout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }


  return (
    <div>
      <h1>Notes</h1>
      <Notify message={errorMessage} />


      {
        user === null
          ? loginForm()
          : <div>
            <div>
              {user.name} loged-in
              <button onClick={logout}>log out</button>
            </div>
            {noteForm()}
          </div>
      }

      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important': 'all'}
      </button>
      <ul>
        {notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportance(note.id)}
          />
        )}
      </ul>
    </div>
  )
}

export default App