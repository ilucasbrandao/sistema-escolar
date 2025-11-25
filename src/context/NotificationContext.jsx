import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import dayjs from "dayjs";

// Cria o contexto
const NotificationContext = createContext({});

// Hook personalizado para facilitar o uso
export function useNotifications() {
    return useContext(NotificationContext);
}

// O Provedor que vai envolver a aplicação
export function NotificationProvider({ children }) {
    const [count, setCount] = useState(0);

    const checkNotifications = async () => {
        try {
            const mes = dayjs().month() + 1;
            const ano = dayjs().year();

            // Reaproveitando sua rota de dashboard que já traz tudo
            // Se ficar pesado no futuro, criamos uma rota leve só para contar (HEAD request)
            const { data } = await api.get("/dashboard", { params: { mes, ano } });

            const qtdInadimplentes = data.inadimplentes?.length || 0;
            const qtdAniversariantes = data.aniversariantes?.length || 0;

            // Define o total de alertas
            setCount(qtdInadimplentes + qtdAniversariantes);

        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    };

    // Verifica ao carregar a página
    useEffect(() => {
        // Só busca se tiver token (usuário logado)
        const token = localStorage.getItem("token");
        if (token) {
            checkNotifications();
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ count, checkNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}