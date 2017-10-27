import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'
import './index.css';
import App from './App';
import Student from './Student'

const StudentRoute = ({match, location}) => (
  <Student {...location.state } />
)

ReactDOM.render(
  <BrowserRouter>
    <div>
    <Route path="/student/:id" component={StudentRoute}/>
    <Route exact path="/" component={App}/>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);
