import React from "react";
import './App.css';
import {Route, Routes} from 'react-router-dom';

import Inicio from "./pages/Inicio"
import Agendar from "./pages/Agendar"
import Robots from "./pages/Robots"
import Historial from "./pages/Historial"
import Usuarios from "./pages/Usuarios"
import InicioL from "./pages/InicioL"
import Clima from "./pages/clima"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path = "/" element={<Inicio />} />
        <Route exact path = "/Inicio" element={<InicioL />} />
        <Route exact path = "/agendar" element={<Agendar />} />
        <Route exact path = "/robots" element={<Robots />} />
        <Route exact path = "/historial" element={<Historial />} />
        <Route exact path = "/usuarios" element={<Usuarios />} />
        <Route exact path = "/clima" element={<Clima />} />
      </Routes>
    </div>
  );
}

export default App;
