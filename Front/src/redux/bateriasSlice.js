import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const getBaterias = createAsyncThunk(
    "robots/baterias",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/getBatteries.php", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
  lista: [
  ],
  seleccionado: null,
};

const bateriasSlice = createSlice({
    name: 'baterias',
    initialState,
    reducers: {
        seleccionarBateria: (state, action) => {
            state.seleccionado = action.payload;
        },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getBaterias.pending, (state) => {
            state.loading = true;
            state.success = false;
            state.error = false;
            state.message = null;
        })
        .addCase(getBaterias.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.error = false;
            state.message = action.payload.message;
            state.lista = action.payload.data;
        })
        .addCase(getBaterias.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload.message || "Error al leer los clientes.";
        });
    }
});

export const { seleccionarBateria } = bateriasSlice.actions;
export default bateriasSlice.reducer;
