import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk para agendar
export const agregarAgendamiento = createAsyncThunk(
  "agendamientos/agregar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost/back/registerAppt.php", {
        method: "POST",
        body: formData,
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

export const getAppt = createAsyncThunk(
    "historial/Appt",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/getAppt.php", {
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

export const getApptDay = createAsyncThunk(
  "agendamientos/ApptDay",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost/back/getApptDay.php", {
        method: "POST",
        body: formData,
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

export const dispatchBatery = createAsyncThunk(
  "agendamientos/batery",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost/back/dispatchBatery.php", {
        method: "POST",
        body: formData,
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

export const dispatchRobot = createAsyncThunk(
  "agendamientos/robot",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost/back/dispatchRobot.php", {
        method: "POST",
        body: formData,
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

// Estado inicial
const initialState = {
  lista: [
    { id: 1, nombre: 'Pedido A', peso: '5kg', hora: '10:00 AM', lugar: 'Calle 123' },
    { id: 2, nombre: 'Pedido B', peso: '3kg', hora: '11:30 AM', lugar: 'Calle 456' },
  ],
  listaBaterias: [],
  filtro: '',
  seleccionado: false,
  loading: false,
  success: false,
  error: null,
  message: "",
  bateriaNecesario: null,
};

const agendamientosSlice = createSlice({
  name: 'agendamientos',
  initialState,
  reducers: {
    agregarAgendamiento11: (state, action) => {
      state.lista.push(action.payload);
    },
    resetAgendamientoState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
    setFiltro: (state, action) => {
      state.filtro = action.payload;
    },
    seleccionarPedido: (state, action) => {
      state.seleccionado = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(agregarAgendamiento.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = "";
      })
      .addCase(agregarAgendamiento.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.error = action.payload.success ? null : action.payload.message;
      })
      .addCase(agregarAgendamiento.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Error al crear el agendamiento.";
        state.message = action.payload || "Error al crear el agendamiento.";
      })

      .addCase(getApptDay.pending, (state) => {
          state.loading = true;
          state.success = false;
          state.error = false;
          state.message = null;
      })
      .addCase(getApptDay.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.message = action.payload.message;
          state.lista = action.payload.data;
      })
      .addCase(getApptDay.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload.message || "Error al leer los clientes.";
      })

      .addCase(dispatchBatery.pending, (state) => {
          state.loading = true;
          state.success = false;
          state.error = false;
          state.message = null;
      })
      .addCase(dispatchBatery.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.message = action.payload.message;
          state.listaBaterias = action.payload.data;
          state.bateriaNecesario = action.payload.bateria;
      })
      .addCase(dispatchBatery.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload.message || "Error al leer los clientes.";
          state.error = action.payload.message || "Error al leer los clientes.";
      })

      .addCase(dispatchRobot.pending, (state) => {
          state.loading = true;
          state.success = false;
          state.error = false;
          state.message = null;
      })
      .addCase(dispatchRobot.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.message = action.payload.message;
          state.listaBaterias = action.payload.data;
      })
      .addCase(dispatchRobot.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.message = action.payload.message || "Error al leer los clientes.";
          state.error = action.payload.message || "Error al leer los clientes.";
      })

      .addCase(getAppt.pending, (state) => {
          state.loading = true;
          state.success = false;
          state.error = false;
          state.message = null;
      })
      .addCase(getAppt.fulfilled, (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = false;
          state.message = action.payload.message;
          state.lista = action.payload.data;
      })
      .addCase(getAppt.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload.message || "Error al leer los clientes.";
      });
  },
});

// Exportaciones
export const {
  resetAgendamientoState,
  agregarAgendamiento11,
  setFiltro,
  seleccionarPedido,
} = agendamientosSlice.actions;

export default agendamientosSlice.reducer;