const express = require('express')
const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
} = require("apollo-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "LIBRARY-APP";
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const path = require('path')

const app = express()


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String]!
    id: ID!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    findBook(title: String!): Book!
  }

  type Mutation {
    createUser(username: String!, favoriteGenre: String!): User

    login(username: String!, password: String!): Token

    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]!
    ): Book

    editAuthor(name: String!, setBornTo: Int): Author
  }
`;

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate("author");
      }
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({ author: author._id, genres: args.genre }).populate(
          "author"
        );
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({ author: author._id }).populate("author");
      } else if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }
    },
    allAuthors: () => Author.find({}),
    findBook: (root, args) => Book.findOne({ title: args.title }),
  },
  Author: {
    bookCount: (root) => Book.find({ author: root._id }).countDocuments(),
  },
  Mutation: {
    addBook: async (root, args,context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      let author = await Author.findOne({ name: args.author });
      try {
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
        const book = new Book({ ...args, author: author._id });
        await book.save();
        return book;
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const editingAuthor = await Author.findOne({ name: args.name });
      if (editingAuthor) {
        editingAuthor.born = args.setBornTo;
        try {
          return editingAuthor.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }
      return null;
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secred") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id).populate(
        "books"
      );
      return { currentUser };
    }
  },
  graphql: true
})
app.use(express.static("build"))

app.get('*',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'build','index.html'))
})

const port = process.env.PORT || 4000
server.listen({port}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
