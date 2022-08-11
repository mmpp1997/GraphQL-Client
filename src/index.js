import { React } from 'react';
import * as ReactDOM from 'react-dom/client';
import { ApolloClient, 
         InMemoryCache, 
         ApolloProvider } from '@apollo/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from '@apollo/client/link/ws'
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql'
});
const wsLink = new WebSocketLink(
  new SubscriptionClient("ws://localhost:5000/graphql")
);
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});





const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
  <ApolloProvider client={client}>
      <App />
  </ApolloProvider>,
  </BrowserRouter>
  
);