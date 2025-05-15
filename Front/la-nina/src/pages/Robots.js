import Navbar from '../components/navbar/Navbar'
import './Robots.css'
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { seleccionarRobot } from '../redux/robotsSlice';



function Robots() {
    const dispatch = useDispatch();
    const robots = useSelector((state) => state.robots.lista);
    const robotSeleccionado = useSelector((state) => state.robots.seleccionado);

    const handleSelectRobot = (robot) => {
        dispatch(seleccionarRobot(robot));
    };
    return (
        <div>
            <Navbar/>
            <div className="robot-info-page">
                <div className="sidebar-robots">
                    <h5 className="fw-bold">Robots Disponibles</h5>
                    <ul className="robot-list">
                    {robots.map((robot) => (
                        <li key={robot.id} onClick={() => handleSelectRobot(robot)}>
                        {robot.nombre}
                        </li>
                    ))}
                    </ul>
                </div>

                <div className="robot-details">
                    {robotSeleccionado && (
                    <div className="robot-card-detail">
                        <div className="robot-image-placeholder" />
                        <h4>{robotSeleccionado.nombre}</h4>
                        <p><strong>Motores:</strong> {robotSeleccionado.motores}</p>
                        <p><strong>Pedidos:</strong> {robotSeleccionado.pedidos}</p>
                        <p><strong>Estado:</strong> {robotSeleccionado.estado}</p>

                        <div className="battery-container">
                        <div className="battery-label">Batería</div>
                        <div className="battery">
                            <div
                            className="battery-level"
                            style={{ width: `${robotSeleccionado.bateria}%` }}
                            />
                        </div>
                        <div className="battery-percentage">
                            {robotSeleccionado.bateria}%
                        </div>
                        </div>
                    </div>
                    )}
                </div>

                <div className="sidebar-camera">
                    <h5 className="fw-bold">Cámara en vivo</h5>
                    <div className="camera-placeholder" />
                    <h6 className="fw-bold mt-4">Historial de pedidos</h6>
                    <ul className="historial-list">
                    {robotSeleccionado?.historial.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                    </ul>
                </div>
            </div>
       </div>
    );
}

export default Robots;