const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'LIBRARY-APP'
const keys = require('./keys')

console.log('connecting to', keys.MONGODB_URI)

mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    genres : [String]!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount : Int!
    allBooks(author:String, genre:String): [Book]!
    allAuthors: [Author]!
    findBook(title:String!):Book!
  }

  type Mutation {
      createUser(
        username: String!
      ): User

      login(
        username: String!
        password: String!
      ): Token

      addBook(
        title: String!
        published: Int!
        author: String!
        genres : [String]!
      ): Book
      
      editAuthor(
        name: String!
        setBornTo: Int
      ): Author
  }
`

const resolvers = {
  Query: {
      bookCount: () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
      allBooks: (root,args) => {
          if(!args.author && !args.genre){
              return Book.find({})
          }
          if(args.author && args.genre){
            return Book.find({author:args.author,genres:args.genre})
          }
          if(args.author){
            return Book.find({author:args.author})
          }else if(args.genre){
              return Book.find({genres:args.genre})
          }
          
      },
      allAuthors: () => Author.find({}),
      findBook: (root,args) => Book.findOne({title:args.title})
  },
  Author : {
    bookCount : (root) => Book.find({author:root.name}).countDocuments()
  },
  Mutation : {
    addBook : async (root,args) => {
        const book = new Book({...args})
        const author = await Author.findOne({name:args.author})
        try {
          if(!author){
            const author = new Author({name:args.author})
            author.save()
          }
          return book.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
          
    },
    editAuthor: async (root,args) => {
        const editingAuthor = await Author.findOne({name:args.name})
            if(editingAuthor){
                editingAuthor.born = args.setBornTo
                try {
                  return editingAuthor.save()
                } catch (error) {
                  throw new UserInputError(error.message, {
                    invalidArgs: args,
                  })
                }
                
            }
            return null
            
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secred' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})