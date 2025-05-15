import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    lista: [
        {
            numeroPedido: '00123',
            nombre: 'Entrega Express',
            peso: 4.5,
            hora: '14:30',
            lugar: 'Bodega 2'
        },
        {
            numeroPedido: '00789',
            nombre: 'Entrega Lenta',
            peso: 20,
            hora: '18:30',
            lugar: 'Bodega 11'
        },
    ]
};

const historialSlice = createSlice({
    name: 'historial',
    initialState,
    reducers: {}
});

export default historialSlice.reducer;
