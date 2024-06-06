/* eslint-disable camelcase */
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { axios, axiosForFiles } from '../api';

const useOrders = (id) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const formFilter = useForm({
    defaultValues: {
      search: "",
      status: "",
      dateStart: "",
      dateStop: "",
    }
  })
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState('')

  const {
    search,
    status,
    dateStart,
    dateStop
  } = useWatch({ control: formFilter.control })

  const { data, error, isLoading, refetch } = useQuery(['propostas', id, page, rowsPerPage, debouncedSearchFilter, status], async () => {
    if (id) {
      const response = await axios.get(`/propostas/${id}`, { params: { page_size: rowsPerPage } });
      return response?.data;
    }
    const response = await axios.get('/propostas', { params: { page_size: rowsPerPage, page: page + 1, search: debouncedSearchFilter, data_criacao_start: dateStart, data_criacao_stop: dateStop, status } });
    return response?.data;
  });

  const handleSearchFilter = debounce((value) => setDebouncedSearchFilter(value));

  useEffect(() => { handleSearchFilter(search) }, [search, handleSearchFilter])
  
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

  const { mutate: deleteOrder, isLoading: isDeleting } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/propostas/${id}`))), {
    onSuccess: () => {
      refetch()
    },
  })

  const deleteOrderAndNavigate = async () => {
    deleteOrder([id])
    navigate('/admin/propostas');
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const edit = async (form, setResponseStatus, setOpen) => {
    const formValues = form.watch()
    try {
      if (formValues.anexo && formValues.anexo instanceof File) {
        const formData = new FormData();
        formData.append('anexo', formValues.anexo);
        await axiosForFiles.patch(`/propostas/${id}/anexar/`, formData)
      }
      if (formValues.enderecoDeEntrega === 'enderecoCadastrado') {
        const response = await axios.patch(`/propostas/${id}/atualizar/`, {
          local: formValues.local || null,
          total: formValues.total || 0,
          prazoDeEntrega: dayjs.isDayjs(formValues.prazoDeEntrega) ? formValues.prazoDeEntrega?.format('YYYY-MM-DD') : null,
          condicaoDePagamento: formValues.formaDePagamento || null,
          transporte: formValues.transporte || null,
          numero: formValues.numeroProposta || 0,
          enderecoDeEntrega: data?.cliente?.endereco || null,
          validade: dayjs.isDayjs(formValues.validade) ? formValues.validade?.format('YYYY-MM-DD') : null,
          dataAprovacao: dayjs.isDayjs(formValues.dataAprovacao) ? formValues.dataAprovacao?.format('YYYY-MM-DD') : null,
          aprovacao: formValues.aprovado || null,
          prazoDePagamento: dayjs.isDayjs(formValues.prazoDePagamento) ? formValues.prazoDePagamento?.format('YYYY-MM-DD') : null,
        });
        setResponseStatus(response)
      } else {
        const response = await axios.patch(`/propostas/${id}/atualizar/`, {
          local: formValues.local || null,
          total: formValues.total || 0,
          prazoDeEntrega: dayjs.isDayjs(formValues.prazoDeEntrega) ? formValues.prazoDeEntrega?.format('YYYY-MM-DD') : null,
          condicaoDePagamento: formValues.formaDePagamento || null,
          transporte: formValues.transporte || null,
          numero: formValues.numeroProposta || 0,
          enderecoDeEntregaAdd:
            {
              cep: formValues.CEP || null,
              numero: formValues.numeroEndereco || null,
              logradouro: formValues.rua || null,
              bairro: formValues.bairro || null,
              cidade: formValues.cidade || null,
              estado: formValues.estado || null,
              complemento: formValues.complemento || null,
            } || null,
          validade: dayjs.isDayjs(formValues.validade) ? formValues.validade?.format('YYYY-MM-DD') : null,
          dataAprovacao: dayjs.isDayjs(formValues.dataAprovacao) ? formValues.dataAprovacao?.format('YYYY-MM-DD') : null,
          aprovacao: formValues.aprovado || null,
          prazoDePagamento: dayjs.isDayjs(formValues.prazoDePagamento) ? formValues.prazoDePagamento?.format('YYYY-MM-DD') : null,
        });
        setResponseStatus(response);
      }
      refetch()
    } catch (error) {
      setResponseStatus(error.response);
      setOpen(true);
      console.log(error);
    }
  };

  const aprovar = async () => {
    try {
      await axios.post(`/propostas/${id}/aprovar/`);
      navigate('/dashboard/propostas');
      return { error: false };
    } catch (err) {
      console.log(err);
      return { error: true };
    }
  };

  const recusar = async () => {
    try {
      await axios.post(`/propostas/${id}/reprovar/`);
      navigate('/dashboard/propostas');
      return { error: false };
    } catch (err) {
      console.log(err);
      return { error: true };
    }
  };
  const propostasEmAnalise = useMemo(
    () => (Array.isArray(data?.results) ? data?.results?.filter((pedido) => pedido.status === 'A') : null),
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
    propostasEmAnalise,
    edit,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    deleteOrderAndNavigate
  };
};

export default useOrders;
