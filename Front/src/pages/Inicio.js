
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openModal, closeModal } from "../redux/modalSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "../components/login/Login";

function Inicio() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.modal.isOpen);
    
    useEffect(() => {
        dispatch(closeModal());
      }, [navigate, dispatch]);

    return (
        <div>
            <button onClick={() => dispatch(openModal())}>
                boton
            </button>
            <div className="dron-volador">🚁</div> {/* Puedes reemplazar con una imagen más adelante */}

            {isOpen && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="row align-items-center">
                        <Login/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inicio;