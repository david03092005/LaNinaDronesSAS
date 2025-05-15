import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import { Carousel, Form, Button} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { agregarAgendamiento } from '../redux/agendamientoSlice';
import './Agendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



function Agendar() {
    const agendamientos = useSelector((state) => state.agendamientos.lista);
    const dispatch = useDispatch();
    const [calendarioFecha, setCalendarioFecha] = useState(new Date());


    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        nombre: '',
        peso: '',
        tamaño: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(agregarAgendamiento({
        id: Date.now(),
        nombre: formData.nombre,
        descripcion: `Peso: ${formData.peso}, Tamaño: ${formData.tamaño}, Fecha: ${formData.fecha} ${formData.hora}`,
        }));
        setFormData({ fecha: '', hora: '', nombre: '', peso: '', tamaño: '' });
    };
    return (
        <div>
            <Navbar/>
            <div className="agendar-row ">
                {/* Columna izquierda: Carrusel + Calendario */}
                <div className="agendar-col">
                    <div className="carrusel-container">
                        <h5 className="fw-bold titulo">Agendamientos en proceso</h5>
                        {agendamientos.length > 0 ? (
                            <Carousel indicators={true} interval={null}>
                            {agendamientos.map((item) => (
                                <Carousel.Item key={item.id}>
                                <div className="robot-card">
                                    <div className="robot-img-placeholder mb-2"></div>
                                    <h6>{item.nombre}</h6>
                                    <p>{item.descripcion}</p>
                                </div>
                                </Carousel.Item>
                            ))}
                            </Carousel>
                        ) : (
                            <p>No hay agendamientos en proceso</p>
                        )}
                    </div>

                    <div className="calendario-container mt-4">
                        <h5 className="fw-bold">Calendario</h5>
                        <DatePicker
                            selected={calendarioFecha}
                            onChange={(date) => setCalendarioFecha(date)}
                            inline />
                    </div>
                </div>

                {/* Columna derecha: Formulario */}
                <div className="agendar-col">
                    <Form onSubmit={handleSubmit} className="agenda-form">
                    {['fecha', 'hora', 'nombre', 'peso', 'tamaño'].map((campo) => (
                        <Form.Group className="mt-2" key={campo}>
                        <Form.Label>{campo.charAt(0).toUpperCase() + campo.slice(1)}</Form.Label>
                        <Form.Control
                            type={campo === 'fecha' ? 'date' : campo === 'hora' ? 'time' : 'text'}
                            name={campo}
                            value={formData[campo]}
                            onChange={handleChange}
                            required
                        />
                        </Form.Group>
                    ))}

                    <Button variant="primary" type="submit" className="mt-3">
                        Agendar
                    </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Agendar;