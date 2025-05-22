import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción asíncrona para crear un administrador
export const createAdministrator = createAsyncThunk(
  "admin/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost/back/createAdmin.php", {
        method: "POST",
        body: formData,
      });
      console.log("Respuesta HTTP recibida:", response);
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


// Acción asíncrona para leer uno o todos los administradores
export const readAdministrator = createAsyncThunk(
  "admin/fetch",
  async (cedula_administrador = "", { rejectWithValue }) => {
    try {
      const formData = new FormData();
      if (cedula_administrador) {
        formData.append("cedula_administrador", cedula_administrador);
      }

      const response = await fetch("http://localhost/back/readAdmin.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al obtener los administradores");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Acción asíncrona para actualizar un administrador
export const updateAdministrator = createAsyncThunk(
  "admin/update",
  async ({ cedula_administrador, nombre_usuario, contrasena }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("cedula_administrador", cedula_administrador);
      if (nombre_usuario) formData.append("nombre_usuario", nombre_usuario);
      if (contrasena) formData.append("contrasena", contrasena);

      const response = await fetch("http://localhost/back/updateAdmin.php", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }
      const data = await response.json(); // Convertir la respuesta a JSON
      return data; // Retornar la respuesta del servidor
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Acción asíncrona para eliminar un administrador
export const deleteAdministrator = createAsyncThunk(
  "admin/delete",
  async ({ cedulaAdminE, cedulaAdmin }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("cedula_admin", cedulaAdminE);
      formData.append("cedula_logueado", cedulaAdmin);

      const response = await fetch("http://localhost/back/deleteAdmin.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message);
      } 

      return { message: data.message, cedulaAdminE };
    } catch (error) {
      return rejectWithValue("Error al eliminar el administrador.");
    }
  }
);


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: "",
    usuario: "",
    contrasena: "",
    admins: [], 
  },
  reducers: {
    resetAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
      state.usuario = "";
      state.contrasena = "";
      // state.admins = [];
    },
  },
  extraReducers: (builder) => {
  builder
    // CREACIÓN
    .addCase(createAdministrator.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.message = "";
    })
    .addCase(createAdministrator.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.usuario = action.payload.usuario;
      state.contrasena = action.payload.contrasena;
    })
    .addCase(createAdministrator.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload || "Error al crear el administrador.";
    })

    // LECTURA
    .addCase(readAdministrator.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(readAdministrator.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.admins = Array.isArray(action.payload.data)
        ? action.payload.data
        : [action.payload.data];
      state.message = action.payload.message;
    })
    .addCase(readAdministrator.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error al obtener los administradores.";
    })

    // ACTUALIZACIÓN 
    .addCase(updateAdministrator.pending, (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.message = "";
    })
    .addCase(updateAdministrator.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
    })
    .addCase(updateAdministrator.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload || "Error al actualizar el administrador.";
    })
        // ELIMINACIÓN
    .addCase(deleteAdministrator.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = "";
    })
    .addCase(deleteAdministrator.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        // Filtra al admin eliminado
        state.admins = state.admins.filter(
            (admin) => admin.cedula_administrador !== action.payload.cedula_admin
        );
    })
    .addCase(deleteAdministrator.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || "Error al eliminar el administrador.";
    })

}

});


export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
