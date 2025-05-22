import Navbar from '../components/navbar/Navbar'
import './Robots.css'
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRobots, seleccionarRobot } from '../redux/robotsSlice';
import { getBaterias, seleccionarBateria } from '../redux/bateriasSlice';
import { useNavigate } from "react-router-dom";



function Robots() {
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);
    
    const ip = "http://10.196.76.160:8080/video"; 
    const dispatch = useDispatch();

    const robots = useSelector((state) => state.robots.lista);
    const robotSeleccionado = useSelector((state) => state.robots.seleccionado);
    
    const baterias = useSelector((state) => state.baterias.lista); 
    const bateriaSeleccionada = useSelector((state) => state.baterias.seleccionado);

    const handleSelectRobot = (robot) => {
        dispatch(seleccionarRobot(robot));
        dispatch(seleccionarBateria(null));
    };

    const handleSelectBateria = (bateria) => {
        dispatch(seleccionarBateria(bateria));
        dispatch(seleccionarRobot(null));
    }

    //Camara
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);

    const capture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/png');
        setImageSrc(dataURL);
      };

    useEffect(() => {
        const data = new FormData();
        dispatch(getRobots(data));
        dispatch(getBaterias(data));
        console.log(robots);
    }, [dispatch]);

    return (
        <div>
          <Navbar />
          <div className="robot-info-page">
    
            <div className="sidebar-robots">
              <h5 className="fw-bold">Robots Disponibles</h5>
              <ul className="robot-list">
                {robots.map((robot) => (
                  <li
                    key={robot.id}
                    onClick={() => handleSelectRobot(robot)}
                    className={robotSeleccionado?.ID_robot === robot.ID_robot ? 'seleccionado' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    {robot.nombre}
                  </li>
                ))}
              </ul>
    
              <h5 className="fw-bold mt-4">Baterías Disponibles</h5>
              <ul className="robot-list">
                {baterias.map((bateria) => (
                    <li
                    key={bateria.ID_bateria}
                    onClick={() => handleSelectBateria(bateria)}
                    className={bateriaSeleccionada?.ID_bateria === bateria.ID_bateria ? 'seleccionado' : ''}
                    style={{ cursor: 'pointer' }}
                    >
                    <div className="robot-nombre">{bateria.ID_bateria}</div>
                    <div className="battery">
                        <div
                        className="battery-level"
                        style={{ width: `${bateria.porcentaje_carga}%` }}
                        />
                    </div>
                    <div className="battery-percentage">{bateria.porcentaje_carga}%</div>
                    </li>
                ))}
                </ul>
            </div>
    
            <div className="robot-details">
              {robotSeleccionado && (
                <div className="robot-card-detail">
                  <img className="robot-image-placeholder" src={robotSeleccionado.imagen_robot} />
                  <h4>{robotSeleccionado.nombre}</h4>
                  <p><strong>Motores:</strong> {robotSeleccionado.num_motores_robot}</p>
                  <p><strong>Tipo (Dron/Robot):</strong> {robotSeleccionado.tipo == true ? <strong>Dron</strong> : <strong>Robot</strong>}</p>
                  <p><strong>Estado:</strong> {robotSeleccionado.estado_robot}</p>
                </div>
              )}
    
              {bateriaSeleccionada && !robotSeleccionado && (
                <div className="robot-card-detail">
                  <h4>Batería #{bateriaSeleccionada.ID_bateria}</h4>
                  <div className="battery-container">
                    <div className="battery-label">Nivel de bateria</div>
                    <div className="battery">
                      <div
                        className="battery-level"
                        style={{ width: `${bateriaSeleccionada.porcentaje_carga}%` }}
                      />
                    </div>
                    <div className="battery-percentage">{bateriaSeleccionada.porcentaje_carga}%</div>
                  </div>
                </div>
              )}
            </div>
    
            <div className="sidebar-camera">
              <h5 className="fw-bold">Cámara en vivo</h5>
                {robotSeleccionado && (
                  <>
                  <img className='camera-placeholder'
                    ref={videoRef}
                    src={ip}
                    autoPlay
                    playsInline
                    muted
                    width="350"
                    height="250"
                  />

                  <canvas ref={canvasRef} style={{ display: 'none' }} />

                </>

                )}
              <h6 className="fw-bold mt-4">Historial de pedidos</h6>
              <ul className="historial-list">
                {(robotSeleccionado?.historial || bateriaSeleccionada?.historial)?.map((item, index) => (
                    <li key={index} className="historial-item">
                    <span>#{item.ID_agendamiento}</span> - {item.fecha} ({item.hora_inicio.slice(0, 5)} - {item.hora_final.slice(0, 5)}) - Usuario: {item.cedula_usuario} - Estado: {item.estado_agendamiento}
                    </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
    );
}

export default Robots;