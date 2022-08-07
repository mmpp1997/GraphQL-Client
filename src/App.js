import './App.css';
import React from "react";
import { Routes,Route} from 'react-router-dom';
import Books from './books';
import Home from './home';
import About from './about';

export default function App() {
  return (
    <div>
      <div>
        <Routes>
          <Route  exact path="/" element={<Home />}/>
          <Route>
            <Route  path="/books" element={<Books />} />
          </Route>
          <Route>
            <Route  path="/about" element={<About />} />
          </Route>
        </Routes>
      </div>
      <br/>
    </div>
    
  );
}

