import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import jwtDecode from "jwt-decode";

import axios from '../api'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const token = window.localStorage.getItem('token')
  const [user, setUser] = useState(token ? { token } : null);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token)
      setUser({ token, nome: decoded?.nome })
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      setLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await axios.post("/login/", {
        username: email,
        password,
      });
      const decoded = jwtDecode(response?.data?.access)
      window.localStorage.setItem('token', response?.data?.access)
      setUser({ token: response?.data?.access, nome: decoded?.nome })
      return { error: false }
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        return { error: "Sem resposta do server" };
      }
      if (err.response?.status === 400) {
        return { error: "Solicitação inválida. O email e/ou senha não foram fornecidos corretamente. Verifique os dados e tente novamente" };
      }
      if (err.response?.status === 401) {
        return { error: "Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente." };
      }
      if (err.response?.status === 500) {
        return { error: "Ocorreu um erro inesperado no servidor." };
      }
      return { error: "Falha no login" };

    } finally {
      setLoading(false)
    }
  };

  const logout = () => {
    window.localStorage.removeItem('token')
    setUser(null)
  };

  useEffect(() => {
    const authenticatedRoutes = [
      '/dashboard',
    ]
    if (!user && authenticatedRoutes.some(route => window.location.pathname.startsWith(route))) navigate('/login')
  }, [user])

  return { user, login, logout, loading }
}

export default AuthProvider