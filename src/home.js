import "./home.css";
import { useQuery, gql, useMutation } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <div class="naslov">
        <h2>AUTORI</h2>
      </div>
      <br />
      <DISPLAY_AUTHORS />
      <div class="razmak">
        <NEW_AUTHOR />
      </div>
      <div>
        <MOVE_AUTHOR />
      </div>
    </div>
  );
}
const ADD_AUTHOR = gql`
  mutation addAuthor($type: String!) {
    addAuthor(name: $type) {
      id
    }
  }
`;
const REMOVE_AUTHOR = gql`
  mutation removeAuthor($type: Int!) {
    removeAuthor(id: $type) {
      id
    }
  }
`;
const GET_AUTHORS = gql`
  query {
    authors {
      id
      name
    }
  }
`;
const AUTHOR_SUBSCRIPTION = gql`
  subscription Subscription {
    AuthorAdded {
      id
      name
    }
  }
`;
function refreshPage() {
  window.location.reload(true);
}
function NEW_AUTHOR() {
  let input;
  const [addAuthor, { loading, error }] = useMutation(ADD_AUTHOR);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <div>
      <form
        class="txt_autor"
        onSubmit={(e) => {
          e.preventDefault();
          addAuthor({ variables: { type: input.value } });
          input.value = "";
        }}
      >
        <input
          ref={(node) => {
            input = node;
          }}
        />
        <button class="dodaj_autora" type="submit">
          Dodaj autora
        </button>
      </form>
    </div>
  );
}

function MOVE_AUTHOR() {
  let input;
  const [removeAuthor, { loading, error }] = useMutation(REMOVE_AUTHOR);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <div>
      <form
        class="txt_autor"
        onSubmit={(e) => {
          e.preventDefault();
          removeAuthor({ variables: { type: parseInt(input.value, 10) } });
          input.value = "";
        }}
      >
        <input
          ref={(node) => {
            input = node;
          }}
        />
        <button class="dodaj_autora" onClick={refreshPage} type="submit">
          Ukoni autora
        </button>
      </form>
    </div>
  );
}
function DISPLAY_AUTHORS() {
  const { loading, error, data, subscribeToMore } = useQuery(GET_AUTHORS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  subscribeToMore({
    document: AUTHOR_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const brojac = prev.authors.length + 1;
      const newauthor = {
        count: brojac,
        __typename: "Author",
        name: subscriptionData.data.AuthorAdded.name,
        id: subscriptionData.data.AuthorAdded.id,
      };
      const exists = prev.authors.find(({ id }) => id === newauthor.id);
      if (exists) return prev;
      return Object.assign({}, prev, {
        authors: [...prev.authors, newauthor],
      });
    },
  });
  return data.authors.map(({ id, name }) => (
    <div class="link_home" key={id}>
      <Link class="link" to="/books" state={{ AUTHOR: name, ID: id }}>
        {name} ({id})
      </Link>
    </div>
  ));
}
