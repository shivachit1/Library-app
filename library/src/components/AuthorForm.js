import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const AuthorForm = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setBornYear] = useState('')

  const [ changeBornYear ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
        console.log(error.Error)
      }
  })
  const submit = (event) => {
    event.preventDefault()
    console.log(name)
    changeBornYear({ variables: { name, setBornTo } })

    setName('')
    setBornYear('')
  }

  const authors = props.authors
  //setName(authors[0].name)
  return (
    <div>
      <h2>Set BirthYear</h2>

      <form onSubmit={submit}>
        <select
        value={name}
         onChange={({target})=>setName(target.value)}>
             <option value="none">none</option>
            {authors.map(author=>(
                <option key ={author.name} value={author.name}>{author.name}</option>
            ))}
          </select>
        <div>
          born <input
          type="number"
            value={setBornTo}
            onChange={({ target }) => setBornYear(parseInt(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorForm