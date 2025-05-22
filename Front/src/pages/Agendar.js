import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import { Carousel, Form, Button} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { agregarAgendamiento, resetAgendamientoState, getAppt } from '../redux/agendamientoSlice';
import './Agendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



function Agendar() {
    const agendamientos = useSelector((state) => state.agendamientos.lista);
    const dispatch = useDispatch();
    const [calendarioFecha, setCalendarioFecha] = useState(new Date());
    const {loading, success, error, message} = useSelector((state) => state.agendamientos);
    const [fechasAgendadas, setFechasAgendadas] = useState([]);

    const [formData, setFormData] = useState({
        cedulaUsuario: '',
        cedulaAdmin: '1',
        fecha: '',
        horaInicio: '',
        estado: 'agendado',
        peso: '',
        alto: '',
        ancho: '',
        largo: '',
        destino: ''
    });

    const camposFormulario = [
    { name: 'cedulaUsuario', label: 'Cédula Usuario', type: 'number' },
    { name: 'fecha', label: 'Fecha', type: 'date' },
    { name: 'horaInicio', label: 'Hora', type: 'time' },
    { name: 'peso', label: 'peso', type: 'number', min: 0.1},
    { name: 'alto', label: 'alto', type: 'number', min: 1},
    { name: 'ancho', label: 'ancho', type: 'number', min: 1},
    { name: 'largo', label: 'largo', type: 'number', min: 1},
    { name: 'destino', label: 'destino', type: 'text'},
    ];


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (event) => {
        setFlag(!flag);
        event.preventDefault();
        const data = new FormData();

        data.append("cedulaUsuario", formData.cedulaUsuario);
        data.append("cedulaAdmin", formData.cedulaAdmin);
        data.append("fecha", formData.fecha);
        data.append("horaInicio", formData.horaInicio);
        data.append("estado", formData.estado);
        data.append("peso", formData.peso);
        data.append("alto", formData.alto);
        data.append("ancho", formData.ancho);
        data.append("largo", formData.largo);
        data.append("destino", formData.destino);

        dispatch(agregarAgendamiento(data));
    };

    //Liminar fecha y hora
    const fechaHoy = new Date().toISOString().split('T')[0];
    const esHoy = formData.fecha === fechaHoy;

    // Limita el rango horario entre 08:00 y 18:00
    const horaMin = esHoy
        ? Math.max(Number(new Date().toTimeString().slice(0, 2)), 8).toString().padStart(2, '0') + ':00'
        : '08:00';
    const horaMax = '18:00';

    // Verificar si el día seleccionado es domingo
    const esDomingo = formData.fecha && new Date(formData.fecha).getDay() === 6;

    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const data = new FormData();
        dispatch(getAppt(data));
        console.log(agendamientos);
    }, [dispatch, flag]);

    useEffect(() => {
        fetch("http://localhost/back/getApptCalender.php")
        .then(res => res.json())
        .then(data => {
            const fechas = data
            .filter(fecha => !isNaN(new Date(fecha)))  // filtrar inválidas
            .map(fecha => new Date(fecha + 'T00:00:00')); // asegurar formato válido
            setFechasAgendadas(fechas);
        });
        console.log(fechasAgendadas);
    }, [flag]);
/*
    useEffect(() => {
        console.log(formData.ID_admin); 
        if (!user) {
            navigate("/");
        }
        if (admin) {
            setFormData((prevState) => ({
                ...prevState,
                cedulaAdmin: admin.ID_usuario,
                nombreAdmin: admin.nombreAdmin || ""
            }));
        }
    }, [user, navigate, usuario]);
*/
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
            dispatch(resetAgendamientoState());
            }, 10000); // Espera 10 segundos antes de limpiar

            return () => clearTimeout(timer); 
        }
    }, [success, error, dispatch]);

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
                                <Carousel.Item key={item.ID_agendamiento}>
                                <div className="robot-card">
                                    {/* <div className="robot-img-placeholder mb-2"></div> */}
                                    <img className="robot-img-placeholder mb-2" src={item.imagen_robot} />
                                    <h6>{item.ID_agendamiento}</h6>
                                    <p>{item.destino}</p>
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
                            inline
                            highlightDates={fechasAgendadas}
                        />
                    </div>
                </div>

                {/* Columna derecha: Formulario */}
                <div className="agendar-col">
                    <Form onSubmit={handleSubmit} className="agenda-form">
                        {camposFormulario.map(({ name, label, type }) => (
                            <Form.Group className="mt-2" key={name}>
                            <Form.Label>{label}</Form.Label>
                            <Form.Control
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required
                                min={
                                name === 'fecha' ? fechaHoy :
                                name === 'horaInicio' ? horaMin :
                                undefined
                                }
                                max={
                                name === 'horaInicio' ? horaMax : undefined
                                }
                                disabled={name === 'horaInicio' && !formData.fecha}
                            />
                            </Form.Group>
                        ))}
                        {/*NO domingos*/ }
                        {esDomingo && (
                            <div className="alert alert-warning mt-2">
                            No se puede agendar en domingos. Por favor selecciona otro día.
                            </div>
                        )}

                        <Button type="submit">Agendar</Button>
                    </Form>
                    {/*Mensajes*/ }
                    {message && (
                        <div className={`alert mt-3 ${success ? 'alert-success' : 'alert-danger'}`}>
                            {message}
                        </div>
                        )}

                </div>
            </div>
        </div>
    );
}

export default Agendar;