import Navbar from '../components/navbar/Navbar';
import './InicioL.css';
import React, { useEffect, useState } from 'react';
import { Carousel, Button, Form, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { seleccionarPedido, getApptDay, dispatchBatery } from '../redux/agendamientoSlice';
import { seleccionarBateria } from '../redux/bateriasSlice';
import { useNavigate } from "react-router-dom";


function InicioL() {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // useEffect(() => {
    //     if (!user) {
    //         navigate("/");
    //     }
    // }, [user, navigate]);

    const despachos = useSelector((state) => state.agendamientos.lista);
    const despachoSeleccionado = useSelector((state) => state.agendamientos.seleccionado);
    const baterias = useSelector((state) => state.agendamientos.listaBaterias);
    const bateriaSeleccionada = useSelector((state) => state.baterias.seleccionado);
    const mensaje = useSelector((state) => state.agendamientos.message);

    const [fechaHoy] = useState(new Date().toLocaleDateString());
    const [climaConsultado, setClimaConsultado] = useState(false);
    const [climaOk, setClimaOk] = useState(false);
    const [alerta, setAlerta] = useState(null);

    const gruposDespachos = [];
    for (let i = 0; i < despachos.length; i += 3) {
        gruposDespachos.push(despachos.slice(i, i + 3));
    }
    
    useEffect(() => {
        if (!despachoSeleccionado && despachos.length > 0) {
            dispatch(seleccionarPedido(despachos[0]));
        }
    }, [despachos, despachoSeleccionado, dispatch]);

    const handleSelect = (selectedIndex) => {
        const grupo = gruposDespachos[selectedIndex];
        console.log(grupo, "Hellos");
        if (grupo && grupo.length > 0) {
        dispatch(seleccionarPedido(grupo[0]));
        setClimaConsultado(false);
        setClimaOk(false);
        dispatch(seleccionarBateria(null));
        setAlerta(null);
        }
    };

    const handleDespachoClick = (despacho) => {
        dispatch(seleccionarPedido(despacho));
        setClimaConsultado(false);
        setClimaOk(false);
        dispatch(seleccionarBateria(null));
        setAlerta(null);
    };

    const calcularTiempo = async () => {
        const data = new FormData();
        data.append("agendamiento", despachoSeleccionado.ID_agendamiento);
        dispatch(dispatchBatery(data));
        await setAlerta({ tipo: 'info', mensaje: mensaje });
    };

    const handleBateriaChange = (e) => {
        const id = e.target.value;
        console.log(id);
        console.log(baterias);
        const bateria = baterias.find(b => b.ID_bateria.toString() === id);
        console.log(bateria);
        dispatch(seleccionarBateria(bateria || null));
    };

    const despachar = () => {
        if (!despachoSeleccionado || !bateriaSeleccionada) {
        setAlerta({ tipo: 'danger', mensaje: 'Debe seleccionar despacho y batería.' });
        return;
        }
        setAlerta({ tipo: 'success', mensaje: `Despachando "${despachoSeleccionado.nombre}" con batería "${bateriaSeleccionada.nombre}".` });
    };

    useEffect(() => {
        const data = new FormData();
        dispatch(getApptDay(data));
        console.log(despachos);
        console.log(gruposDespachos, "Hellos");
    }, [dispatch]);

    const selectedIndex = Math.max(0, gruposDespachos.findIndex(grupo =>
        grupo.some(d => d.ID_agendamiento === despachoSeleccionado?.ID_agendamiento)
    ));

    function formatearHora(hora) {
        if (!hora || typeof hora !== "string") return "";
        return hora.slice(0, 5);
    }

    const fetchWeather = async () => {
        const params = {
            latitude: 3.4516,
            longitude: -76.5320,
            hourly: "temperature_2m,precipitation,precipitation_probability",
            timezone: "America/Bogota",
        };

        const query = new URLSearchParams(params).toString();
        const url = `https://api.open-meteo.com/v1/forecast?${query}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            const times = data.hourly.time.map((timeStr) => new Date(timeStr));
            const now = new Date();

            // Encuentra el índice de la hora más cercana a la actual
            const closestIndex = times.findIndex(t => 
            t.getHours() === now.getHours() && 
            t.getDate() === now.getDate() &&
            t.getMonth() === now.getMonth()
            );

            const temperature = data.hourly.temperature_2m[closestIndex];
            const precipitation = data.hourly.precipitation[closestIndex];
            const probability = data.hourly.precipitation_probability[closestIndex];

            let mensajeClima = `Temperatura actual: ${temperature}°C. `;

            if (probability >= 70) {
            mensajeClima += "Alta probabilidad de lluvia.";
            } else if (probability >= 40) {
            mensajeClima += "Posibilidad moderada de lluvia.";
            } else {
            mensajeClima += "Baja probabilidad de lluvia.";
            }

            setAlerta({ tipo: 'success', mensaje: mensajeClima });
            setClimaOk(true);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setAlerta({ tipo: 'danger', mensaje: 'Error al consultar el clima.' });
            setClimaOk(false);
        } finally {
            setClimaConsultado(true);
        }
    };

    const consultarClima = () => {
        fetchWeather(); // Ya actualiza los estados necesarios internamente
    };


    return (
        <div>
            <Navbar/>
            <div className="despachos-container">
                <div className="header">
                <h2 className="titulo">Despachos del día</h2>
                <div className="fecha">{fechaHoy}</div>
                </div>

                <div className="carrusel-wrapper">
                {gruposDespachos.length > 0 ? (
                    <Carousel
                    activeIndex={selectedIndex}
                    onSelect={handleSelect}
                    interval={null}
                    indicators={false}
                    prevLabel=""
                    nextLabel=""
                    >
                    {gruposDespachos.map((grupo, idx) => (
                        <Carousel.Item key={idx}>
                        <div className="grupo-cards">
                            {grupo.map((item) => (
                            <div
                                key={item.ID_agendamiento}
                                className={`despacho-card-pequena ${item.ID_agendamiento === despachoSeleccionado?.ID_agendamiento ? 'seleccionado' : ''}`}
                                onClick={() => handleDespachoClick(item)}
                            >
                                <h3>{item.ID_agendamiento}</h3>
                                <h6>{item.destino}</h6>
                                <p>{formatearHora(item.hora_inicio)}</p>
                            </div>
                            ))}
                        </div>
                        </Carousel.Item>
                    ))}
                    </Carousel>
                ) : (
                    <p>No hay despachos agendados para hoy.</p>
                )}
                </div>

                <div className="info-control-row">
                <div className="info-despacho">
                    <h5>Información del despacho</h5>
                    {despachoSeleccionado ? (
                    <div>
                        <p><b>ID Agendamiento:</b> {despachoSeleccionado.ID_agendamiento}</p>
                        <p><b>Cédula Usuario:</b> {despachoSeleccionado.cedula_usuario}</p>
                        <p><b>Cédula Administrador:</b> {despachoSeleccionado.cedula_administrador}</p>
                        <p><b>ID Robot:</b> {despachoSeleccionado.ID_robot}</p>
                        <p><b>ID Batería:</b> {despachoSeleccionado.ID_bateria}</p>
                        <p><b>Fecha:</b> {despachoSeleccionado.fecha}</p>
                        <p><b>Hora Inicio:</b> {formatearHora(despachoSeleccionado.hora_inicio)}</p>
                        <p><b>Hora Final:</b> {formatearHora(despachoSeleccionado.hora_final)}</p>
                        <p><b>Estado del Agendamiento:</b> {despachoSeleccionado.estado_agendamiento}</p>
                        <p><b>Destino:</b> {despachoSeleccionado.destino}</p>
                    </div>
                    ) : (
                    <p>Seleccione un despacho en el carrusel.</p>
                    )}
                </div>

                <div className="controles">
                    <Button
                    variant="primary"
                    onClick={consultarClima}
                    className="mb-3 btn-personalizado"
                    disabled={climaConsultado}
                    >
                    Consultar Clima
                    </Button>

                    <Button
                    variant="primary"
                    onClick={calcularTiempo}
                    disabled={!climaOk}
                    className="mb-3 btn-personalizado"
                    >
                    Calcular Tiempo
                    </Button>

                    <Form.Select
                    disabled={!climaOk}
                    value={bateriaSeleccionada?.ID_bateria || ''}
                    onChange={handleBateriaChange}
                    aria-label="Lista de baterías"
                    className="select-custom"
                    >
                    <option value="">Seleccione batería</option>
                    {baterias.map((b) => (
                        <option key={b.ID_bateria} value={b.ID_bateria}>{b.ID_bateria} ({b.porcentaje_carga}%)</option>
                    ))}
                    </Form.Select>
                </div>
                </div>

                {alerta && (
                <Alert variant={alerta.tipo} onClose={() => setAlerta(null)} dismissible className="alert-personalizado">
                    {alerta.mensaje}
                </Alert>
                )}

                <div className="boton-despachar-wrapper">
                <Button
                variant="primary"
                size="lg"
                onClick={despachar}
                disabled={!bateriaSeleccionada}
                className="btn-personalizado"
                >
                Despachar
                </Button>
            </div>
        </div>
      </div>
    );
}

export default InicioL;