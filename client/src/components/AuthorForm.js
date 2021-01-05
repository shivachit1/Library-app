import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'

const AuthorForm = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setBornYear] = useState('')

  const [ changeBornYear ] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
        console.log(error.Error)
      },
      update: (store, response) => {
        const dataInStore = store.readQuery({ query: ALL_AUTHORS })
        store.writeQuery({
          query: ALL_AUTHORS,
          data: {
            ...dataInStore,
            allAuthors: dataInStore.allAuthors.map(author=>author.name===response.data.editAuthor.name ? response.data.editAuthor : author)
          }
        })
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
        <div>Select Author</div>
        <select
        value={name}
         onChange={({target})=>setName(target.value)}>
             <option value="none">none</option>
            {authors.map(author=>(
                <option key ={author.name} value={author.name}>{author.name}</option>
            ))}
          </select>
        <div>
          Born Year<input
          type="number"
            value={setBornTo}
            placeholder="i.e: 1994"
            onChange={({ target }) => setBornYear(parseInt(target.value))}
          />
        </div>
        <button className="blueButton" type='submit'>update author</button>
      </form>
    </div>
  )
}

export default AuthorForm