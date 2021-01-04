import {useState, useEffect} from 'react'
import { useLazyQuery, useQuery } from '@apollo/client';
import { ALL_BOOKS, FIND_BOOK } from '../queries'


const Books = (props) => {
  const result = useQuery(ALL_BOOKS)
  const [getBook, bookResult] = useLazyQuery(FIND_BOOK) 
  const [book, setBook] = useState(null)

  const showBook = (bookTitle) => {
    getBook({ variables: { bookToSearch: bookTitle } })
  }

  useEffect(() => {
    if (bookResult.data) {
      setBook(bookResult.data.findBook)
    }
  }, [bookResult])

  if (book) {
    return(
      <div>
        <h2>{book.title}</h2>
        <div>{book.author}</div>
        <button onClick={() => setBook(null)}>close</button>
      </div>
    )
  }
  if (!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }
  
  const books = result.data.allBooks
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title} onClick={showBook}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books