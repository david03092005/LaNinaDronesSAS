import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lista: [
    { id: 1, nombre: 'Pedido A', peso: '5kg', hora: '10:00 AM', lugar: 'Calle 123' },
    { id: 2, nombre: 'Pedido B', peso: '3kg', hora: '11:30 AM', lugar: 'Calle 456' },
  ],
  filtro: '',  
  seleccionado: null, 
};

const agendamientosSlice = createSlice({
  name: 'agendamientos',
  initialState,
  reducers: {
    agregarAgendamiento: (state, action) => {
      state.lista.push(action.payload);
    },
  },
});

export const { agregarAgendamiento, setFiltro, seleccionarPedido } = agendamientosSlice.actions;
export default agendamientosSlice.reducer;

