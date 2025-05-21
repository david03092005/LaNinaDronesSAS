import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getRobots = createAsyncThunk(
    "robots/record",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/getRobots.php", {
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
  loading: false,
  success: false,
  error: false,
  message: null,
  lista: [
    {
      ID_robot: "0",
      nombre: "Drone X1",
      tipo: "1", // Corresponde al ID en la tabla tipo
      estado_robot: "Disponible",
      num_motores_robot: "4",
      imagen_robot: "../../Front/public/img/robot0.jpg"
    },
    {
      ID_robot: "1",
      nombre: "Drone Z2",
      tipo: "2",
      estado_robot: "En mantenimiento",
      num_motores_robot: "6",
      imagen_robot: "https://example.com/img/drone-z2.png"
    }
  ]
};

const robotsSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    seleccionarRobot(state, action) {
      state.seleccionado = action.payload;
    },
    seleccionarBateria(state, action) {
      state.seleccionada = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRobots.pending, (state) => {
          state.loading = true;
          state.success = false;
          state.error = false;
          state.message = null;
      })
      .addCase(getRobots.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.message = action.payload.message;
          state.lista = action.payload.data;
      })
      .addCase(getRobots.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload.message || "Error al leer los clientes.";
      });
  }
});

export const { seleccionarRobot, seleccionarBateria } = robotsSlice.actions;
export default robotsSlice.reducer;
