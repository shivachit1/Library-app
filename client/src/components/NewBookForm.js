import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK,ALL_BOOKS, ALL_AUTHORS  } from '../queries'

const NewBookForm = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const [ createNewBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_BOOKS },{ query: ALL_AUTHORS } ],
    onError: (error) => {
        console.log(error.Error)
      }
    })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    console.log('add book...')
    createNewBook({  variables: {title, author,published, genres}})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>Create New Book</h2>
      <form onSubmit={submit}>
        <div>
          Title :
          <input
            value={title}
            placeholder="Book Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author :
          <input
            value={author}
            placeholder="Book Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          Published :
          <input
            type='number'
            value={published}
            placeholder="Published Year"
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div style={{margin:10}}>
          Genres: 
          <p>{genres.join(' ')}</p>
        </div>
        <div>
          <input
            value={genre}
            placeholder="Book genre"
            onChange={({ target }) => setGenre(target.value)}
          />
          <button className="blueButton" onClick={addGenre} type="button">add genre</button>
        </div>
        
        
        <button className="greenButton" type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBookForm