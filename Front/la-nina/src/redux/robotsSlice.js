import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lista: [
    { id: 1, nombre: 'Robot A', motores: 4, pedidos: 12, estado: 'Activo', bateria: 78, historial: ['Pedido 1', 'Pedido 2'] },
    { id: 2, nombre: 'Robot B', motores: 6, pedidos: 20, estado: 'Inactivo', bateria: 55, historial: ['Pedido 3', 'Pedido 4'] },
  ],
  seleccionado: null,
};

const robotsSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    seleccionarRobot(state, action) {
      state.seleccionado = action.payload;
    },
  },
});

export const { seleccionarRobot } = robotsSlice.actions;
export default robotsSlice.reducer;
