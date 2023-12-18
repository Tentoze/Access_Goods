import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/molecules/Header';
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./components/structures/Login";
import Item from "./pages/Item";
import Registration from "./pages/Registration";
import RentNewItem from "./pages/RentNewItem";
import MyItems from "./pages/MyItems";


const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/search" Component={Search} />
          <Route path="/item/:itemId" Component={Item} />
          <Route path="/register" Component={Registration} />
          <Route path="/rent-new-item" Component={RentNewItem} />
          <Route path="/my-items" Component={MyItems} />
        </Routes>
      </Router>
  );
};

export default App;