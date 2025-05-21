import Navbar from '../components/navbar/Navbar';
import './Historial.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button} from 'react-bootstrap';
import { getRecord, makeReport } from '../redux/historialSlice'
import jsPDF from 'jspdf';

function Historial() {

    const dispatch = useDispatch();
    const [generarPDF, setGenerarPDF] = useState(false);

    useEffect(() => {
        const data = new FormData();
        dispatch(getRecord(data));
    }, [dispatch]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("fechaInicio", formData.fechaInicio);
        data.append("fechaFin", formData.fechaFin);
        await dispatch(makeReport(data));
        setGenerarPDF(true);
    }

    const handleDownloadPDF = (event) => {
        const doc = new jsPDF();
        let y = 20;

        doc.setFontSize(16);
        doc.text('Historial de Agendamientos', 20, y);
        y += 10;

        agendamientosFiltrados.forEach((agendamiento, index) => {
            if (y > 270) {  // Salto de página si se pasa del límite
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(14);
            doc.text(`Agendamiento #${agendamiento.ID_agendamiento}`, 20, y);
            y += 8;

            doc.setFontSize(11);
            doc.text(`Cédula Usuario: ${agendamiento.cedula_usuario}`, 20, y);
            y += 6;
            doc.text(`Cédula Administrador: ${agendamiento.cedula_administrador}`, 20, y);
            y += 6;
            doc.text(`ID Robot: ${agendamiento.ID_robot}`, 20, y);
            y += 6;
            doc.text(`ID Batería: ${agendamiento.ID_bateria}`, 20, y);
            y += 6;
            doc.text(`Fecha: ${agendamiento.fecha}`, 20, y);
            y += 6;
            doc.text(`Hora Inicio: ${agendamiento.hora_inicio}`, 20, y);
            y += 6;
            doc.text(`Hora Final: ${agendamiento.hora_final}`, 20, y);
            y += 6;
            doc.text(`Estado: ${agendamiento.estado_agendamiento}`, 20, y);
            y += 12;
        });

        doc.save('Historial_Agendamientos.pdf');
    };

    const agendamientos = useSelector((state) => state.historial.lista);
    const [busqueda, setBusqueda] = useState('');
    const [modalData, setModalData] = useState(null);
    const [modalReporte, setModalReporte] = useState(null);
    const [formData, setFormData] = useState({
        fechaInicio: "",
        fechaFin: ""
    });

    useEffect(() => {
        if (generarPDF) {
            handleDownloadPDF();
            setGenerarPDF(false); // Restablece la bandera
        }
    }, [agendamientos, generarPDF]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        console.log(formData);
    };


    console.log(agendamientos)
    const agendamientosFiltrados = agendamientos.filter(item =>
        item.ID_agendamiento.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.cedula_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.cedula_administrador.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.ID_robot.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.ID_bateria.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.fecha.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.hora_inicio.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.hora_final.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.estado_agendamiento.toLowerCase().includes(busqueda.toLowerCase())
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
                        <span>#{item.ID_agendamiento}</span> - {item.fecha} ({item.hora_inicio.slice(0, 5)} - {item.hora_final.slice(0, 5)}) - Usuario: {item.cedula_usuario} - Estado: {item.estado_agendamiento}
                        </li>
                    ))} 
                </ul>

                <div className="boton-reporte-container">
                    <Button variant="primary" className="btn-generar-reporte" onClick={() => setModalReporte(true)}>
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

                    <hr />
                    <p><strong>ID Agendamiento:</strong> {modalData?.ID_agendamiento}</p>
                    <p><strong>Cédula Usuario:</strong> {modalData?.cedula_usuario}</p>
                    <p><strong>Cédula Administrador:</strong> {modalData?.cedula_administrador}</p>
                    <p><strong>ID Robot:</strong> {modalData?.ID_robot}</p>
                    <p><strong>ID Batería:</strong> {modalData?.ID_bateria}</p>
                    <p><strong>Fecha:</strong> {modalData?.fecha}</p>
                    <p><strong>Hora Inicio:</strong> {modalData?.hora_inicio?.slice(0, 5)}</p>
                    <p><strong>Hora Final:</strong> {modalData?.hora_final?.slice(0, 5)}</p>
                    <p><strong>Estado:</strong> {modalData?.estado_agendamiento}</p>
                </Modal.Body>
            </Modal>

            <Modal show={!!modalReporte} onHide={() => {setModalReporte(null); dispatch(getRecord());}} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Agendamiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>hello</p>
                    <input
                        type="date"
                        className="input-filtro"
                        name="fechaInicio"
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        className="input-filtro"
                        name="fechaFin"
                        onChange={handleChange}
                        min={formData.fechaInicio}
                    />
                    <Button variant="primary" className="btn-generar-reporte" onClick={handleSubmit}>
                        Imprimir reporte
                    </Button>
                </Modal.Body>
            </Modal>
            {/* <Modal show={!!modalData} onHide={() => setModalData(null)} centered>
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
          </Modal> */}
        </div>
    );
}

export default Historial;
