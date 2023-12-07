import "./About.css";
import { useQuery, gql, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom";

export default function About() {
  const location = useLocation();
  const data = location.state;
  console.log(data);
  return (
    <div>
      <DISPLAY_INFO />
      <div>
        <div>
          <U_BOOK />
        </div>
      </div>
    </div>
  );
}

const GET_INFO = gql`
  query book($oznaka: Int) {
    book(id: $oznaka) {
      author {
        name
      }
      name
      year
      genre
    }
  }
`;
const UPDATE_BOOK = gql`
  mutation updateBook($nname: String!, $type: Int!) {
    updateBook(newName: $nname, id: $type) {
      id
    }
  }
`;
function refreshPage() {
  window.location.reload(true);
}
function U_BOOK() {
  const location = useLocation();
  const state = location.state;
  let input;
  const [updateAuthor, { loading, error }] = useMutation(UPDATE_BOOK);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <div>
      <form
        class="txt_autor"
        onSubmit={(e) => {
          e.preventDefault();
          updateAuthor({ variables: { nname: input.value, type: state.ID } });
          input.value = "";
        }}
      >
        <input
          ref={(node) => {
            input = node;
          }}
        />

        <button class="dodaj_autora" onClick={refreshPage} type="submit">
          Izmjeni naziv
        </button>
      </form>
    </div>
  );
}

function DISPLAY_INFO() {
  const location = useLocation();
  const state = location.state;
  const { loading, error, data } = useQuery(GET_INFO, {
    variables: { oznaka: state.ID },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <div class="link_box">
      <h2>Autor: {data.book.author.name}</h2>
      <h2>Naziv: {data.book.name}</h2>
      <h2>Žanr: {data.book.genre}</h2>
      <h2>Godina: {data.book.year}</h2>
    </div>
  );
}
