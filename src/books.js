import './Book.css';
import { useQuery, gql,useMutation } from '@apollo/client';
import { Link, useLocation } from 'react-router-dom';

export default function Books(props) {
  const location = useLocation();
  const data = location.state;
  console.log(data);
  return (
    
    <div>
      <div class="naslov"><h2>{data.AUTHOR}</h2></div>
      
      <br/>
      <DISPLAY_BOOKS/>
      <div class="razmak">
          <NEW_BOOK/>
      </div>
      <div>
          <MOVE_BOOK/>
      </div>
      <div>
        <U_AUTHOR/>
      </div>
      
      
    </div>
    
  );
}

const GET_BOOKS = gql`
  query author($oznaka: Int){
    author(id: $oznaka){
      books{
        id
        name}
  }
}
`;
const ADD_BOOK = gql`
  mutation updateAuthor($type: String! $Aid: Int!){
    updateAuthor(name: $type authorId:$Aid)
    {id}
  }
`;
const REMOVE_BOOK = gql`
  mutation removeBook($type: Int!){
    removeBook(id: $type)
    {id}
  }
`;
const UPDATE_AUTHOR = gql`
  mutation updateAuthor($nname: String! $type: Int!){
    updateAuthor(newName: $nname id:$type)
    {id}
  }
`;
function refreshPage() {
  window.location.reload(true);
}
function NEW_BOOK() {
  const location = useLocation();
  const state = location.state;
  let input;
  const [updateAuthor, { data, loading, error }] = useMutation(ADD_BOOK);
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;
  return (
      <div>
      <form class="txt_autor"
        onSubmit={e => {
          e.preventDefault();
          updateAuthor({ variables: { type: input.value, Aid:state.ID}});
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button class="dodaj_autora" onClick={refreshPage} type="submit">Dodaj knjigu</button>
      </form>
    </div>
  )
}

function MOVE_BOOK() {
  let input;
  const [removeBook, { data, loading, error }] = useMutation(REMOVE_BOOK);
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;
  return (
      <div>
      <form class="txt_autor"
        onSubmit={e => {
          e.preventDefault();
          removeBook({ variables: { type: parseInt(input.value,10)}});
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button class="dodaj_autora" onClick={refreshPage} type="submit">Ukoni knjigu</button>
      </form>
    </div>
  )
}
function U_AUTHOR() {
  const location = useLocation();
  const state = location.state;
  let input;
  const [updateAuthor, { data, loading, error }] = useMutation(UPDATE_AUTHOR);
  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;
  return (
      <div>
      <form class="txt_autor"
        onSubmit={e => {
          e.preventDefault();
          updateAuthor({ variables: { nname: input.value, type:state.ID}});
          input.value = '';
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        
        <button class="dodaj_autora" onClick={refreshPage} type="submit">Izmjeni autora</button>
      </form>
    </div>
  )
}

function DISPLAY_BOOKS() {
  const location = useLocation();
  const state = location.state;
  const { loading, error, data } = useQuery(GET_BOOKS,{variables: {oznaka: state.ID}});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return data.author.books.map(({ id, name}) => (
    <div>
    <div class="link_book"key={id}>
        <Link class="link" to="/about" state={{ID: id}}>{name}</Link>
    </div>
    </div>
  ));
}

