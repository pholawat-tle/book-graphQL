import { ApolloServer, ApolloError, gql } from 'apollo-server-express';
import * as DataLoader from 'dataloader';
import * as express from 'express';
import router from './router';

const app: express.Application = express();
app.use(express.json());

app.use(router);

const books: Omit<Book, 'author'>[] = [
  {
    title: 'My book',
    authorID: [1, 2, 4],
  },
  {
    title: 'My other book',
    authorID: [1, 2, 3]
  }
]

const authors: Omit<Author, 'books'>[] = [
  {
    id: 1,
    name: 'Pholawat'
  },
  {
    id: 2,
    name: 'Tle'
  },
  {
    id: 3,
    name: 'Apple'
  },
  {
    id: 4,
    name: 'Banana'
  },
]

interface Book {
  title: string,
  authorID: number[],
  author: Author[]
}

interface Author {
  id: number,
  name: string,
  books: Book[]
}

const typeDefs = gql`
  type Book {
    title: String
    authorID: [Int]
    author: [Author]
    authorFromLoader: [Author]
  }

  type Author {
    id: Int
    name: String
    books: [Book]!
  }

  type Query {
    books: [Book]!
    author(id: Int): Author
  }
`;

const resolvers = {
  Book: {
    author: (book: Omit<Book, 'author'>) => getAuthor(book.authorID) || new ApolloError('Author not found!'),
    authorFromLoader: (book: Omit<Book, 'author'>, args: {}, { authorLoader }) => authorLoader.loadMany(book.authorID) || new ApolloError('Author not found!')
  },
  Author: {
    books: (author: Omit<Author, 'books'>) => books.filter(book => book.authorID.includes(author.id))
  },
  Query: {
    books: () => books,
    author: (_, args: {id: number}) => authors.find(author => author.id === args.id)
  }
}

function getAuthor(authorIDs: number[]) {
  console.log('Loading normally', authorIDs)
  const authorMap: Record<number, Omit<Author, 'books'>> = {};

  for (const author of authors) {
    authorMap[author.id] = author;
  }
  return authorIDs.map(authorID => authorMap[authorID])
}

async function authorBatchFunction(keys: number[]) {
  console.log('Loading with loader', keys)
  const authorMap: Record<number, Omit<Author, 'books'>> = {};

  for (const author of authors) {
    authorMap[author.id] = author;
  }

  return keys.map(key => authorMap[key] || null)
}

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
      return {
        authorLoader: new DataLoader(authorBatchFunction)
      }
    }
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>(resolve => app.listen(3000, resolve));
  console.log('Application is running on http://localhost:3000');
}

startApolloServer(typeDefs, resolvers)

export default app;
