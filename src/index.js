import { React } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider,gql } from '@apollo/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});
client
  .query({
    query: gql`
      query{
        authors {
          id
          name
        }
      }
    `,
  })
  .then((result) => console.log(result));
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
  <ApolloProvider client={client}>
      <App />
  </ApolloProvider>,
  </BrowserRouter>
  
);