import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Acción asincrónica para hacer login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/login.php", {
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

// Acción para verificar el código 2FA
export const verificarCodigo2FA = createAsyncThunk(
    "auth/verificarCodigo2FA",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await fetch("http://localhost/back/auth.php", {
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

// Slice de autenticación
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        mensaje: "",
        loading: false,
        error: null,
        fase: "login", // Puede ser "login" o "2fa"
        cedulaAdmin: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.mensaje = "Sesión cerrada";
            state.error = null;
            state.loading = false;
            state.fase = "login";
            state.cedulaAdmin = null;

            // Limpiar credenciales temporales del localStorage
            localStorage.removeItem("usuario_2fa");
            localStorage.removeItem("contrasena_2fa");
        },
    },
    extraReducers: (builder) => {
        builder
            // LOGIN
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.mensaje = "";
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.fase === "2fa") {
                    // Se requiere código 2FA
                    state.fase = "2fa";
                    localStorage.setItem("usuario_2fa", action.meta.arg.get("usuario"));
                    localStorage.setItem("contrasena_2fa", action.meta.arg.get("contrasena"));
                    state.mensaje = "Se ha enviado un código de autenticación a tu correo.";
                } else if (action.payload.success) {
                    // Login exitoso
                    state.user = action.payload.usuario;
                    state.mensaje = action.payload.message;
                    state.fase = "login";

                    // Guardar cédula del administrador si aplica
                    if (action.payload.usuario.rol === "0") {
                        state.cedulaAdmin = action.payload.cedula;
                    }
                } else {
                    // Error en el login
                    state.error = action.payload.message;
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error al iniciar sesión";
            })

            // VERIFICACIÓN 2FA
            .addCase(verificarCodigo2FA.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verificarCodigo2FA.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    state.user = action.payload;
                    state.fase = "login";
                    state.mensaje = "Inicio de sesión exitoso.";
                    state.cedulaAdmin = action.payload.cedula;

                    // Limpiar localStorage
                    localStorage.removeItem("usuario_2fa");
                    localStorage.removeItem("contrasena_2fa");
                } else {
                    state.error = action.payload.message || "Código incorrecto.";
                }
            })
            .addCase(verificarCodigo2FA.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error al verificar el código.";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
