import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" replace />;

    try {
        const decoded = jwt_decode(token);
        const now = Date.now() / 1000; // timestamp em segundos
        if (decoded.exp < now) {
            localStorage.removeItem("token"); // remove token expirado
            return <Navigate to="/login" replace />;
        }
    } catch (err) {
        // se o token estiver inválido
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    return children;
}
