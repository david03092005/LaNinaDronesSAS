import Navbar from '../components/navbar/Navbar';
import './Historial.css';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button} from 'react-bootstrap';

function Historial() {
    const agendamientos = useSelector((state) => state.historial.lista);
    const [busqueda, setBusqueda] = useState('');
    const [modalData, setModalData] = useState(null);

    const agendamientosFiltrados = agendamientos.filter(item =>
        item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.numeroPedido.includes(busqueda)
    );

    return (
        <div>
            <Navbar />
            <div className="historial-container">
              <div className="historial-card">
                <h4 className="titulo-principal">Agendamientos Pasados</h4>

                <input
                    type="text"
                    className="input-filtro"
                    placeholder="Buscar agendamiento..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <ul className="historial-listado mt-3">
                    {agendamientosFiltrados.map((item, index) => (
                        <li key={index} onClick={() => setModalData(item)}>
                            <span>#{item.numeroPedido}</span> - {item.nombre}
                        </li>
                    ))}
                </ul>

                <div className="boton-reporte-container">
                    <Button variant="primary" className="btn-generar-reporte">
                        Generar Reporte
                    </Button>
                </div>
              </div>
            </div>

            <Modal show={!!modalData} onHide={() => setModalData(null)} centered>
              <Modal.Header closeButton>
                  <Modal.Title>Detalle del Agendamiento</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <p><strong>#Pedido:</strong> {modalData?.numeroPedido}</p>
                  <p><strong>Nombre:</strong> {modalData?.nombre}</p>
                  <p><strong>Peso:</strong> {modalData?.peso} kg</p>
                  <p><strong>Hora:</strong> {modalData?.hora}</p>
                  <p><strong>Lugar:</strong> {modalData?.lugar}</p>
              </Modal.Body>
          </Modal>
        </div>
    );
}

export default Historial;
