import { gql  } from '@apollo/client'

export const ALL_BOOKS = gql`
query {
  allBooks  {
    title
    author, 
    published
  }
}
`
export const FIND_BOOK = gql`
query findBookByTitle($bookToSearch: String!) {
  findBook(title: $bookToSearch) {
    title,
    author,
    published
  }
}
`

export const CREATE_BOOK = gql`
mutation createNewBook($title: String!, $author: String!, $published: Int!, $genres:[String]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author
  }
}
`
export const ALL_AUTHORS = gql`
query {
  allAuthors  {
    name,
    born,
    bookCount
  }
}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo)  {
      name
      born
      bookCount
    }
  }
`