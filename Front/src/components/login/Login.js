import '../login/Login.css';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/modalSlice';
import { Modal, Button } from 'react-bootstrap';
import { FaRobot } from 'react-icons/fa';
import { loginUser, verificarCodigo2FA} from "../../redux/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const show = useSelector((state) => state.modal.isOpen);
  
  const { mensaje, loading, error, user, fase} = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        usuario: "",
        contrasena: "",
        codigo_2fa: ""
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };


  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("usuario", formData.usuario);
        data.append("contrasena", formData.contrasena);
        console.log("HOLAAA DESDE EL LOGIN");
        dispatch(loginUser(data));
    };

    const handleCodigoSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        // data.append("usuario", formData.usuario);
        // data.append("contrasena", formData.contrasena);
        data.append("codigo_2fa", formData.codigo_2fa);
        console.log("Código ingresado:", data.get("codigo_2fa")); // Debug

        dispatch(verificarCodigo2FA(data));
    };

    useEffect(() => {
        if (user) {
            if (user.usuario) {
              navigate("/inicio");
            }
        }
    }, [user, navigate]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="modal-login-body position-relative pt-5">
        <div className="logo-container">
          <FaRobot size={50} />
        </div>

        {fase === "login" ? (
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="form__group field">
              <input
                type="text"
                className="form__field"
                placeholder="Usuario"
                name="usuario"
                required
                value={formData.usuario}
                onChange={handleChange}
              />
              <label className="form__label">Nombre</label>
            </div>

            <div className="form__group field">
              <input
                type="password"
                className="form__field"
                placeholder=""
                name="contrasena"
                required
                value={formData.contrasena}
                onChange={handleChange}
              />
              <label className="form__label">Contraseña</label>
            </div>

            <Button type="submit" className="login-btn-primary mt-3">
              Continuar
            </Button>
          </form>
        )
        :
        (
          <form onSubmit={handleCodigoSubmit} className="mt-4">
            <div className="form__group field">
              <input
                type="text"
                className="form__field"
                placeholder=""
                name="codigo_2fa"
                required
                value={formData.codigo_2fa}
                onChange={handleChange}
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


