/* eslint-disable camelcase */
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import {axios, axiosForFiles} from '../api';
import useClients from './useClients';

const useOrders = (id) => {
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useQuery(['propostas', id], async () => {
    if (id) {
      const response = await axios.get(`/propostas/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/propostas', { params: { page_size: 9999 } });
    return response?.data?.results;
  });

  const { clientes: cliente } = useClients(data?.cliente?.id);

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

  const deleteOrder = async () => {
    await axios.delete(`/propostas/${id}`);
    navigate('/admin/pedidos');
  };
  const edit = async (form, setResponseStatus, setOpen) => {
    const {
      form: { local, total, forma_de_pagamento, transporte, numero, data_aprovacao, certificado: anexo },
      numero: numeroCasa,
      CEP,
      rua,
      bairro,
      cidade,
      estado,
      enderecoEntrega,
      aprovado,
      complemento,
      validade,
      prazoDeEntrega,
    } = form;
    try {
      if (anexo && anexo instanceof File) {
        const formData = new FormData();
        formData.append('anexo', anexo);
        await axiosForFiles.patch(`/propostas/${id}/anexar/`, formData)
      }
      if (enderecoEntrega === 'enderecoCadastrado') {
        const response = await axios.patch(`/propostas/${id}/atualizar/`, {
          local: local || null,
          total: total || 0,
          prazoDeEntrega: dayjs.isDayjs (prazoDeEntrega) ? prazoDeEntrega?.format('YYYY-MM-DD') : null,
          condicaoDePagamento: forma_de_pagamento || null,
          transporte: transporte || null,
          numero: numero || 0,
          enderedoDeEntrega: cliente.endereco || null,
          validade: dayjs.isDayjs(validade) ? validade?.format('YYYY-MM-DD') : null,
          data_aprovacao: dayjs.isDayjs(data_aprovacao) ? data_aprovacao?.format('YYYY-MM-DD') : null,
          aprovacao: aprovado || null,
        });
        setResponseStatus(response)
      } else {
          const response = await axios.patch(`/propostas/${id}/atualizar/`, {
          local: local || null,
          total: total || 0,
          prazoDeEntrega: dayjs.isDayjs(prazoDeEntrega) ? prazoDeEntrega?.format('YYYY-MM-DD') : null,
          condicaoDePagamento: forma_de_pagamento || null,
          transporte: transporte || null,
          numero: numero || 0,
          enderecoDeEntregaAdd:
            {
              cep: CEP || null,
              numero: numeroCasa || null,
              logradouro: rua || null,
              bairro: bairro || null,
              cidade: cidade || null,
              estado: estado || null,
              complemento: complemento || null,
            } || null,
          validade: dayjs.isDayjs(validade) ? validade?.format('YYYY-MM-DD') : null,
          dataAprovacao: dayjs.isDayjs(data_aprovacao) ? data_aprovacao?.format('YYYY-MM-DD') : null,
          aprovacao: aprovado || null,
        });
        setResponseStatus(response);
      }
    } catch (error) {
      setResponseStatus
         (error.response);
      setOpen(true);
      console.log(error);
    }
  };

  const aprovar = async () => {
    try {
      await axios.post(`/propostas/${id}/aprovar/`);
      navigate('/dashboard/pedidos');
      return { error: false };
    } catch (err) {
      console.log(err);
      return { error: true };
    }
  };

  const recusar = async () => {
    try {
      await axios.post(`/propostas/${id}/reprovar/`);
      navigate('/dashboard/pedidos');
      return { error: false };
    } catch (err) {
      console.log(err);
      return { error: true };
    }
  };
  const pedidosEmAnalise = useMemo(
    () => (Array.isArray(data) ? data?.filter((pedido) => pedido.status === 'A') : null),
    [data]
  );

  return {
    data,
    error,
    isLoading,
    deleteOrder,
    refetch,
    aprovar,
    recusar,
    aprovacaoProposta,
    colorAprovacaoProposta,
    pedidosEmAnalise,
    edit,
  };
};

export default useOrders;
