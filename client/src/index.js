import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './App.css'
import { setContext } from 'apollo-link-context'
import { ApolloClient,ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('libraryApp-userToken')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

// for production 
const httpLink = new HttpLink({ uri: '/graphql' })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, 
document.getElementById('root'))
