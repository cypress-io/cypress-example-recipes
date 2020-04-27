import React from 'react'
import './styles.css'
import ApolloClient, { gql } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { useQuery, useMutation } from '@apollo/react-hooks'

const client = new ApolloClient({
  // TODO move external 3rd party URL to either this repo
  // or to our service, similar to jsonplaceholder.cypress.io
  uri: 'https://75183.sse.codesandbox.io/',
})

export const GET_BOOKS = gql`
  {
    books {
      title
      author {
        name
        email
      }
      synopsis
    }
  }
`

const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $synopsis: String!
    $authorName: String!
    $authorEmail: String!
  ) {
    addBook(
      book: {
        title: $title
        author: { name: $authorName, email: $authorEmail }
        synopsis: $synopsis
      }
    ) {
      id
      title
      synopsis
      author {
        name
        email
      }
    }
  }
`

export function Library () {
  let titleInput
  let authorEmailInput
  let authorNameInput
  let synopsisInput

  const { loading, error, data } = useQuery(GET_BOOKS)

  const [addBook] = useMutation(ADD_BOOK, {
    update (
      cache,
      {
        data: { addBook },
      }
    ) {
      const { books } = cache.readQuery({ query: GET_BOOKS })

      cache.writeQuery({
        query: GET_BOOKS,
        data: { books: books.concat([addBook]) },
      })
    },
  })

  if (loading) return <p>Loading ...</p>

  if (error) return <p>Error :(</p>

  return (
    <div className="inputContainer">
      <input
        placeholder="Book Title"
        ref={(node) => {
          titleInput = node
        }}
      />
      <input
        placeholder="Book Synopsis"
        ref={(node) => {
          synopsisInput = node
        }}
      />
      <input
        placeholder="Author Name"
        ref={(node) => {
          authorNameInput = node
        }}
      />
      <input
        placeholder="Auhtor Email"
        ref={(node) => {
          authorEmailInput = node
        }}
      />
      <button
        onClick={() =>
          addBook({
            variables: {
              title: titleInput.value,
              authorName: authorNameInput.value,
              authorEmail: authorEmailInput.value,
              synopsis: synopsisInput.value,
            },
          })
        }
      >
        Add Book
      </button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Synopsis</th>
          </tr>
        </thead>
        <tbody>
          {data.books.map((book, idx) => (
            <tr data-cy="book" key={idx}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.synopsis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function App ({ apolloClient }) {
  return (
    <ApolloProvider client={apolloClient || client}>
      <div className="App">
        <h1>Welcome to my library!</h1>
        <Library />
      </div>
    </ApolloProvider>
  )
}
