import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../redux/modalSlice";
import agendamientosReducer from '../redux/agendamientoSlice';
import robotsReducer from '../redux/robotsSlice';
import historialReducer from '../redux/historialSlice';
import authReducer from '../redux/authSlice';
import bateriasReducer from '../redux/bateriasSlice';

const store = configureStore({
    reducer: {
      modal: modalReducer,
      agendamientos: agendamientosReducer,
      robots: robotsReducer,
      historial: historialReducer,
      auth: authReducer,
      baterias: bateriasReducer
    },
  });
  
  export default store;