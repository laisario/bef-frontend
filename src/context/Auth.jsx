import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { axios } from '../api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const token = window.localStorage.getItem('token');
  const [user, setUser] = useState(token ? { token } : null);
  const storedClienteId = window.localStorage.getItem('clienteId');
  const [clienteId, setClienteId] = useState(storedClienteId || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ token, nome: decoded?.nome, admin: decoded?.admin, id: decoded?.user_id });
    }
  }, [token]);

  const redirectUsers = useCallback((user) => {
    const adminRoutes = ['/admin'];
    const authenticatedRoutes = ['/dashboard', '/admin'];
    if (!user && authenticatedRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/login', { state: { redirect: window.location.hash.slice(1) } });
    }
    if (user?.admin === true && !adminRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/admin');
    }
    if (user?.admin === false && adminRoutes.some((route) => window.location.hash.includes(route))) {
      return navigate('/dashboard');
    }

    return null
  }, [navigate])

  useEffect(() => {
    redirectUsers(user)
  }, [user, redirectUsers]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        clienteId,
        setClienteId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { user, setUser, loading, setLoading, clienteId, setClienteId } = useContext(AuthContext);
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/login/', {
        username: email,
        password,
      });

      const decoded = jwtDecode(response?.data?.access);
      window.localStorage.setItem('token', response?.data?.access);
      setUser({ token: response?.data?.access, nome: decoded?.nome, admin: decoded?.admin });
      return { error: false };
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        return { error: 'Sem resposta do server' };
      }
      if (err.response?.status === 400) {
        return {
          error:
            'Solicitação inválida. O email e/ou senha não foram fornecidos corretamente. Verifique os dados e tente novamente',
        };
      }
      if (err.response?.status === 401) {
        return { error: 'Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.' };
      }
      if (err.response?.status === 500) {
        return { error: 'Ocorreu um erro inesperado no servidor.' };
      }
      return { error: 'Falha no login' };
    } finally {
      setLoading(false);
    }
  };

  const registerBasics = async ({ nome, telefone, cpf, empresa, razaoSocial, cnpj, ie, nomeFantasia, filial }) => {
    setLoading(true);
    try {
      const payload = !empresa ? { nome, telefone, cpf } : { empresa, razaoSocial, cnpj, ie, nomeFantasia, filial };
      const response = await axios.post('/register/basics/', payload);
      setClienteId(response?.data);
      window.localStorage.setItem('clienteId', response?.data);
      return response;
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        return { error: 'Sem resposta do server' };
      }
      return err;
    } finally {
      setLoading(false);
    }
  };

  const registerLocation = async ({ uf, cidade, bairro, logradouro, numero, cep }) => {
    setLoading(true);
    try {
      const payload = { clienteId, uf, cidade, bairro, logradouro, numero, cep };
      const response = await axios.post('/register/location/', payload);
      return response;
    } catch (err) {
      console.error(err);
      if (!err?.response) {
        return { error: 'Sem resposta do server' };
      }
      return err
    } finally {
      setLoading(false);
    }
  };

  const registerAuth = async ({ password, email }) => {
    setLoading(true);
    try {
      const payload = { clienteId, password, username: email };
      const response = await axios.post('/register/auth/', payload);
      return response;
    } catch (err) {
      console.error(err);
      return err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    setUser(null);
  };

  return { user, login, logout, loading, registerBasics, registerLocation, registerAuth };
};

export default AuthProvider;
