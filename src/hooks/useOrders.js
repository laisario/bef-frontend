import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import axios from '../api';

const useOrders = (id) => {
  const [order, setOrder] = useState();
  const navigate = useNavigate()
  const { data, error, isLoading, refetch } = useQuery(['propostas'], async () => {
    const response = await axios.get('/propostas', { params: { page_size: 9999 } });
    return response?.data;
  });

  const aprovacaoProposta = {
    null: 'Proposta em análise',
    false: 'Proposta negada',
    true: 'Proposta aprovada',
  };

  
  const colorAprovacaoProposta = {
    null: 'info',
    false: 'error',
    true: 'success',
  };

  const getOrder = async () => {
    const response = await axios.get(`/propostas/${id}`);
    return response?.data;
  };

  const deleteOrder = async () => {
    await axios.delete(`/propostas/${id}`);
    // await refetch();
    navigate('/dashboard/pedidos')
  };

  const edit = async (form) => {
    await axios.patch(`/propostas/${id}/`, form);
    // await refetch();
    navigate('/admin/pedidos')
  };

  const aprovar = async () => {
    try {
      await axios.post(`/propostas/${id}/aprovar/`);
      // await refetch();
      navigate('/dashboard/pedidos')
      return { error: false };
    } catch (err) {
      console.log(err);
      return { error: true };
    }
  };

  const finalizar = async () => {
    try {
      await axios.post(`/propostas/${id}/finalizar/`);
      // await refetch();
      navigate('/dashboard/pedidos')
      return { error: false };
    } catch (err) {
      return { error: true };
    }
  };

  const recusar = async () => {
    try {
      await axios.post(`/propostas/${id}/reprovar/`);
      // await refetch();
      navigate('/dashboard/pedidos')
      return { error: false };
    } catch (err) {
      console.log(err);
      return { error: true };
    }
  };
  const pedidosEmAnalise =  useMemo(() => data?.filter(pedido => pedido.status === 'A' ), [data])

  useEffect(() => {
    (async () => {
      const response = await getOrder(id);
      setOrder(response);
    })();
  }, []);

  return {
    todasPropostas: data,
    error,
    isLoading,
    getOrder,
    deleteOrder,
    refetch,
    aprovar,
    recusar,
    order,
    finalizar,
    aprovacaoProposta,
    colorAprovacaoProposta,
    pedidosEmAnalise,
    edit
  };
};

export default useOrders;
