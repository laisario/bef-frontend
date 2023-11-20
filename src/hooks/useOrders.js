/* eslint-disable camelcase */
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import axios from '../api';
import useClients from './useClients';

const useOrders = (id) => {
  const navigate = useNavigate();

  const { data, error, isLoading, refetch } = useQuery(['propostas', id], async () => {
    if (id) {
      const response = await axios.get(`/propostas/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/propostas', { params: { page_size: 9999 } });
    return response?.data;
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
    navigate('/dashboard/pedidos');
  };
  const edit = async (form, setErr, setOpen) => {
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
      prazo_de_entrega,
    } = form;
    const formData = new FormData();
    formData.append('anexo', anexo);
    try {
      if (anexo && anexo instanceof File) {
        await axios({
          method: 'patch',
          url: `/propostas/${id}/anexar/`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      if (enderecoEntrega === 'enderecoCadastrado') {
        await axios.patch(`/propostas/${id}/atualizar/`, {
          local: local || null,
          total: total || 0,
          prazo_de_entrega: prazo_de_entrega ? prazo_de_entrega?.format('YYYY-MM-DD') : null,
          condicao_de_pagamento: forma_de_pagamento || null,
          transporte: transporte || null,
          numero: numero || 0,
          endereco_de_entrega: cliente.endereco || null,
          validade: validade ? validade?.format('YYYY-MM-DD') : null,
          data_aprovacao: data_aprovacao || null,
          aprovacao: aprovado === 'true',
        });
      } else {
        await axios.patch(`/propostas/${id}/atualizar/`, {
          local: local || null,
          total: total || 0,
          prazo_de_entrega: prazo_de_entrega ? prazo_de_entrega?.format('YYYY-MM-DD') : null,
          condicao_de_pagamento: forma_de_pagamento || null,
          transporte: transporte || null,
          numero: numero || 0,
          endereco_de_entrega_add:
            {
              cep: CEP || null,
              numero: numeroCasa || null,
              logradouro: rua || null,
              bairro: bairro || null,
              cidade: cidade || null,
              estado: estado || null,
              complemento: complemento || null,
            } || null,
          validade: validade ? validade?.format('YYYY-MM-DD') : null,
          data_aprovacao: data_aprovacao || null,
          aprovacao: aprovado === 'true',
        });
      }
    } catch (error) {
      setErr(error);
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
