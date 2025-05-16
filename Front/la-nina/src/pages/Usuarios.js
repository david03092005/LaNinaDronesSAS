import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import './Usuarios.css';

function Usuarios() {
    const [activeTab, setActiveTab] = useState('registrar');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

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
                                <h4 className="mb-3">Registrar Usuario</h4>
                                <form>
                                    <input className="form-control mb-3" type="text" placeholder="Nombre" />
                                    <input className="form-control mb-3" type="number" placeholder="Cédula" />
                                    <button className="btn btn-primary small-btn">Guardar</button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'buscar' && (
                            <div>
                                <h4 className="mb-3">Buscar Usuario</h4>
                                <input className="form-control mb-3" type="number" placeholder="Cédula del usuario" />
                                <table className="table table-striped mt-3">
                                    <thead>
                                        <tr>
                                            <th>Cédula</th>
                                            <th>Nombre</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>123456</td>
                                            <td>Ejemplo</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'actualizar' && (
                            <div>
                                <h4 className="mb-3">Actualizar Usuario</h4>
                                <select className="form-select mb-3">
                                    <option>Seleccionar Usuario</option>
                                    <option>Ejemplo (123456)</option>
                                </select>
                                <input className="form-control mb-3" type="text" placeholder="Nuevo Nombre" />
                                <button className="btn btn-primary me-2 small-btn">Guardar Cambios</button>
                                <button className="btn btn-secondary small-btn">Cancelar</button>
                            </div>
                        )}

                        {activeTab === 'eliminar' && (
                            <div>
                                <h4 className="mb-3">Eliminar Usuario</h4>
                                <select className="form-select mb-3">
                                    <option>Seleccionar Usuario</option>
                                    <option>Ejemplo (123456)</option>
                                </select>
                                <button className="btn btn-danger small-btn">Eliminar</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Usuarios;
