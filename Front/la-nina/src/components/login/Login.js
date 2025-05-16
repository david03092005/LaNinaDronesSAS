import '../login/Login.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/modalSlice';
import { Modal, Button } from 'react-bootstrap';
import { FaRobot } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const show = useSelector((state) => state.modal.isOpen);
  
  const [step, setStep] = useState(1); 

  const handleClose = () => {
    dispatch(closeModal());
    setStep(1); 
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    console.log("Datos de login enviados");
    setStep(2); 
  };

  const handleSubmitToken = (e) => {
    e.preventDefault();
    console.log("Token enviado");
    handleClose(); 
     navigate('/Inicio');
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="modal-login-body position-relative pt-5">
        <div className="logo-container">
          <FaRobot size={50} />
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmitLogin} className="mt-4">
            <div className="form__group field">
              <input
                type="text"
                className="form__field"
                placeholder=""
                name="nombre"
                required
              />
              <label className="form__label">Nombre</label>
            </div>

            <div className="form__group field">
              <input
                type="password"
                className="form__field"
                placeholder=""
                name="contraseña"
                required
              />
              <label className="form__label">Contraseña</label>
            </div>

            <Button type="submit" className="login-btn-primary mt-3">
              Continuar
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmitToken} className="mt-4">
            <div className="form__group field">
              <input
                type="text"
                className="form__field"
                placeholder=""
                name="token"
                required
              />
              <label className="form__label">Código de verificación</label>
            </div>

            <Button type="submit" className="login-btn-secondary">
              Iniciar sesión
            </Button>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Login;


