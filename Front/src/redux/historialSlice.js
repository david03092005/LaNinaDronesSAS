import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const getRecord = createAsyncThunk(
    "historial/record",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/getRecord.php", {
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

export const makeReport = createAsyncThunk(
    "historial/report",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/makeReport.php", {
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
    loading: false,
    success: false,
    error: false,
    message: null,
    lista: [
        {
            ID_agendamiento: "1",
            cedula_usuario: "1104805321",
            cedula_administrador: "0",
            ID_robot: "0",
            ID_bateria: "1",
            fecha: "2025-05-17",
            hora_inicio: "16:52:29.000000",
            hora_final: "17:10:00.000000",
            estado_agendamiento: "Reservado"
        },
    ]
};

const historialSlice = createSlice({
    name: 'historial',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRecord.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = false;
                state.message = null;
            })
            .addCase(getRecord.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message;
                state.lista = action.payload.data;
            })
            .addCase(getRecord.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload.message || "Error al leer los clientes.";
            })

            .addCase(makeReport.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = false;
                state.message = null;
            })
            .addCase(makeReport.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = false;
                state.message = action.payload.message;
                state.lista = action.payload.data;
            })
            .addCase(makeReport.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload.message || "Error al leer los clientes.";
            });
    }
});

export default historialSlice.reducer;
