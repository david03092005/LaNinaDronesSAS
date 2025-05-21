import Navbar from '../components/navbar/Navbar';
import './InicioL.css';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function InicioL() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar/>
            
        </div>
    );
}

export default InicioL;