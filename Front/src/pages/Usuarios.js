import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAdministrator, resetAdminState, readAdministrator, updateAdministrator, deleteAdministrator} from '../redux/adminSlice';
import Navbar from '../components/navbar/Navbar';
import './Usuarios.css';
import { useNavigate } from "react-router-dom";


function Usuarios() {
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);    
    
    const dispatch = useDispatch();
    const { loading, success, error, message, usuario, contrasena, admins } = useSelector((state) => state.admin);
    const [activeTab, setActiveTab] = useState('registrar');
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const cedulaAdmin = useSelector(state => state.auth.cedulaAdmin);

  
    const [formData, setFormData] = useState({
        cedula_administrador: '',
        nombre_administrador: '',
        contrasena: '',
    });

    const [searchCedula, setSearchCedula] = useState("");

    const filteredAdmins = admins.filter(admin =>
        searchCedula === "" || admin.cedula_administrador.toString().startsWith(searchCedula)
    );

    const handleSearchChange = (event) => {
        console.log(searchCedula)
        setSearchCedula(event.target.value);
    };

    const togglePasswordVisibility = (cedula) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [cedula]: !prev[cedula],
        }));
    };

    const handleUpdate = () => {
        const { cedula_administrador, nombre_administrador, contrasena } = formData;
        if (!cedula_administrador) {
            alert("Selecciona un administrador para actualizar.");
            return;
        }

        dispatch(updateAdministrator({
            cedula_administrador,
            nombre_usuario: nombre_administrador,
            contrasena
        }));

        setFormData({
        cedula_administrador: '',
        nombre_administrador: '',
        contrasena: '',
        });
    };


    const handleTabClick = (tab) => {
        setActiveTab(tab);
        dispatch(resetAdminState());
        if (tab === "registrar") {
            setFormData({
                cedula_administrador: '',
                nombre_administrador: '',
                contrasena: '',
            });
        }
        else if (tab === "buscar") {
            dispatch(readAdministrator()); 
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
            if (name === "cedula_administrador" && activeTab !== 'eliminar') {
                // Si se cambia el administrador, limpiar los demás campos
                setFormData({
                    cedula_administrador: value,
                    nombre_administrador: '',
                    contrasena: ''
                });
            } else {
                // Para los demás inputs, solo actualiza ese campo
                setFormData(prevData => ({
                    ...prevData,
                    [name]: value
                }));
            }
    };

    const handleDelete = (cedulaAdminE) => {
        console.log(cedulaAdmin);
        console.log(cedulaAdminE);
        if (cedulaAdminE == cedulaAdmin) {
            alert("No puedes eliminarte a ti mismo.");
            return;
        }

        else if (window.confirm("¿Estás seguro que quieres eliminar este administrador?")) {
            dispatch(deleteAdministrator({ cedulaAdminE, cedulaAdmin }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Enviando datos...", formData);
        const data = new FormData();
        data.append("cedula_administrador", formData.cedula_administrador);
        data.append("nombre_administrador", formData.nombre_administrador);
        data.append("contrasena", formData.contrasena);
        dispatch(createAdministrator(data));

    
    };
    
    useEffect(() => {
        if (activeTab === "registrar" && success) {
            // Limpiar formulario si el registro fue exitoso
            setFormData({
                cedula_administrador: '',
                nombre_administrador: '',
                contrasena: '',
            });
        }

        if ((activeTab === "registrar" || activeTab === "actualizar") && (success || error)) {
            const timer = setTimeout(() => {
                dispatch(resetAdminState());
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [success, error, dispatch, activeTab]);


    return (
        <div>
            <Navbar />
            <div className="usuarios-page">
                <div className="usuarios-container">
                    <div className="tab-buttons">
                        {['registrar', 'buscar', 'actualizar', 'eliminar'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content mt-4">
                        {activeTab === 'registrar' && (
                            <div>
                                <h4 className="mb-3">Registrar Administrador</h4>
                                <form onSubmit={handleSubmit}>
                                    <input className="form-control mb-3" type="number" name="cedula_administrador" placeholder="Cédula" value={formData.cedula_administrador} onChange={handleChange} required />
                                    <input className="form-control mb-3" type="text" name="nombre_administrador" placeholder="Nombre" value={formData.nombre_administrador} onChange={handleChange} required />
                                    <input className="form-control mb-3" type="password" name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} required />
                                    <button className="btn btn-primary small-btn" type="submit" disabled={loading}>
                                        {loading ? "Registrando..." : "Guardar"}
                                    </button>
                                </form>

                                {success && (
                                    <div className="alert alert-success mt-3">
                                        {message}<br />
                                        <strong>Usuario:</strong> {usuario}<br />
                                        <strong>Contraseña:</strong> {contrasena}
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger mt-3">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'buscar' && (
                            <div>
                                <h4 className="mb-3">Buscar Usuario</h4>

                                <input
                                    className="form-control mb-3"
                                    type="number"
                                    placeholder="Cédula del usuario"
                                    value={searchCedula}
                                    onChange={handleSearchChange}
                                />

                                {filteredAdmins.length > 0 ? (
                                    <table className="table table-striped mt-3">
                                        <thead>
                                            <tr>
                                                <th>Cédula</th>
                                                <th>Nombre</th>
                                                <th>Usuario</th>
                                                <th>Contraseña</th>
                                                <th>Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAdmins.map((admin) => (
                                                <tr key={admin.cedula_administrador}>
                                                    <td>{admin.cedula_administrador}</td>
                                                    <td>{admin.nombre_administrador}</td>
                                                    <td>{admin.nombre_usuario}</td>
                                                    <td>
                                                        {visiblePasswords[admin.cedula_administrador]
                                                            ? admin.contraseña
                                                            : '*'.repeat(admin.contraseña.length)}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => togglePasswordVisibility(admin.cedula_administrador)}
                                                        >
                                                            {visiblePasswords[admin.cedula_administrador] ? 'Ocultar' : 'Ver'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="alert alert-warning">No se encontraron administradores.</div>
                                )}
                            </div>
                        )}


                        {activeTab === 'actualizar' && (
                            <div>
                                <h4 className="mb-3">Actualizar Usuario</h4>
                                <select 
                                    className="form-select mb-3" 
                                    value={formData.cedula_administrador || ""}
                                    name="cedula_administrador"
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar Usuario</option>
                                    {admins.map(admin => (
                                        <option key={admin.cedula_administrador} value={admin.cedula_administrador}>
                                            {admin.nombre_administrador} ({admin.cedula_administrador})
                                        </option>
                                    ))}
                                </select>

                                {/* Nombre nuevo */}
                                <input 
                                    className="form-control mb-3" 
                                    type="text" 
                                    name="nombre_administrador"
                                    placeholder="Nuevo Nombre"
                                    value={formData.nombre_administrador}
                                    onChange={handleChange}
                                />

                                {/* Contraseña nueva */}
                                <input 
                                    className="form-control mb-3" 
                                    type="password" 
                                    name="contrasena"
                                    placeholder="Nueva Contraseña"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                />

                                {/* Botones */}
                                <button 
                                    className="btn btn-primary me-2 small-btn"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? "Actualizando..." : "Guardar Cambios"}
                                </button>

                                <button 
                                    className="btn btn-secondary small-btn"
                                    onClick={() => setFormData({ ...formData, nombre_administrador: "", contrasena: "" })}
                                >
                                    Cancelar
                                </button>

                                {/* Mensajes */}
                                {success && (<div className="alert alert-success mt-3">{message}</div>)}
                                {error && <div className="alert alert-danger mt-3">{error}</div>}
                            </div>
                        )}

                        {activeTab === 'eliminar' && (
                        <div>
                            <h4 className="mb-3">Eliminar Usuario</h4>
                            <select
                                className="form-select mb-3"
                                value={formData.cedula_administrador || ""}
                                name="cedula_administrador"
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar Usuario</option>
                                {admins
                                    .filter(admin => admin.cedula_administrador !== cedulaAdmin)
                                    .map(admin => (
                                        <option key={admin.cedula_administrador} value={admin.cedula_administrador}>
                                            {admin.nombre_administrador} ({admin.cedula_administrador})
                                        </option>
                                    ))}
                            </select>

                            <button
                                className="btn btn-danger small-btn"
                                onClick={() => handleDelete(formData.cedula_administrador)}
                                disabled={!formData.cedula_administrador || loading}
                            >
                                {loading ? "Eliminando..." : "Eliminar"}
                            </button>

                            {/* Mensajes con Redux */}
                            {success && <div className="alert alert-success mt-3">{message}</div>}
                            {error && <div className="alert alert-danger mt-3">{message}</div>}
                        </div>
                    )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Usuarios;
