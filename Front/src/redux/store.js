import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "../redux/modalSlice";
import agendamientosReducer from '../redux/agendamientoSlice';
import robotsReducer from '../redux/robotsSlice';
import historialReducer from '../redux/historialSlice';

const store = configureStore({
    reducer: {
      modal: modalReducer,
      agendamientos: agendamientosReducer,
      robots: robotsReducer,
      historial: historialReducer,
    },
  });
  
  export default store;