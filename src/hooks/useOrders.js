/* eslint-disable camelcase */
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import { axios } from '../api';

const useOrders = (id, cliente) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState('')

  const formFilter = useForm({
    defaultValues: {
      search: "",
      status: "",
      dateStart: "",
      dateStop: "",
      filterByDate: false,
    }
  })

  const {
    search,
    status,
    dateStart,
    dateStop,
    filterByDate,
  } = useWatch({ control: formFilter.control })

  const queryClient = useQueryClient()

  const { data, error, isLoading, refetch } = useQuery(['propostas', id, page, rowsPerPage, debouncedSearchFilter, status, filterByDate], async () => {
    if (id) {
      let params = { page_size: rowsPerPage}
      if (cliente !== null) {
        params = { ...params, cliente, }
      }
      const response = await axios.get(`/propostas/${id}`, { params });
      return response?.data;
    }
    const response = await axios.get('/propostas',
      {
        params:
        {
          page_size: rowsPerPage,
          page: page + 1,
          search: debouncedSearchFilter,
          data_criacao_after: dateStart ? dayjs(dateStart).format('YYYY-MM-DD') : null,
          data_criacao_before: dateStop ? dayjs(dateStop).format('YYYY-MM-DD') : null,
          status
        }
      });
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

  const statusColor = {
    "E": 'info',
    "AA": 'warning',
    "A": 'success',
    "R": 'error',
  }

  const statusString = {
    "E": 'Em elaboração',
    "AA": 'Aguardando aprovação',
    "A": 'Aprovada',
    "R": 'Reprovada',
  }

  const { mutate: deleteOrder, isLoading: isDeleting } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/propostas/${id}`))), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })


  const deleteOrderAndNavigate = async () => {
    deleteOrder([id])
    await refetch()
    navigate('/admin/propostas');
  };

  const removeInstrument = async (instrumentId) => {
    try {
      await axios.post(`/propostas/${id}/remover_instrumento/`, { instrumento_id: instrumentId });
    } catch (err) {
      console.log(err);
    }
  }

  const { mutate: removeInstrumentProposal, isLoading: isRemoving } = useMutation({
    mutationFn: removeInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const elaborate = async (form, editProposol, setResponse, setOpenAlert) => {
    const formValues = form.watch()
    const formatDayjs = (date) => dayjs.isDayjs(date) ? date.format('YYYY-MM-DD') : null;
    const commonData = {
      total: formValues.total || 0,
      condicaoDePagamento: formValues.formaDePagamento || null,
      transporte: formValues.transporte || null,
      numero: formValues.numeroProposta || 0,
      validade: formatDayjs(formValues.validade) || null,
      status: formValues.status || null,
      prazoDePagamento: formatDayjs(formValues.prazoDePagamento) || null,
      edit: editProposol,
      responsavel: formValues.responsavel || null,
      diasUteis: formValues.diasUteis || null,
    };

    try {
      let response;
      if (formValues.enderecoDeEntrega === 'enderecoCadastrado') {
        response = await axios.patch(`/propostas/${id}/elaborar/`, {
          ...commonData,
          enderecoDeEntrega: data?.cliente?.endereco?.id || null,
        });
      } else {
        response = await axios.patch(`/propostas/${id}/elaborar/`, {
          ...commonData,
          enderecoDeEntregaAdd: {
            cep: formValues.CEP || null,
            numero: formValues.numeroEndereco || null,
            logradouro: formValues.rua || null,
            bairro: formValues.bairro || null,
            cidade: formValues.cidade || null,
            estado: formValues.estado || null,
            complemento: formValues.complemento || null,
          } || null,
        });
      }
      setResponse({ status: response?.status, message: response?.data?.message });
    } catch (error) {
      console.log(error)
      setResponse({ status: error?.response?.status, message: "Ocorreu um erro ao elaborar a proposta, verifique se preencheu corretamente." });
    }
    setOpenAlert(true);
    await refetch()
  };

  const sendProposolByEmail = async () => {
    try {
      const response = await axios.get(`/propostas/${id}/enviar_email/`);
      return { status: response?.status, message: response?.data?.message, };
    } catch (err) {
      console.log(err);
      return { status: err.status, message: "Falha no envio da proposta." };
    }
  }


  const aprove = async () => {
    try {
      const response = await axios.post(`/propostas/${id}/aprovar/`);
      refetch()
      return { status: response?.status, message: response?.data?.message };
    } catch (err) {
      console.log(err);
      return { status: err.status, message: "Falha na aprovação da proposta." };
    }
  };

  const refuse = async () => {
    try {
      const response = await axios.post(`/propostas/${id}/reprovar/`);
      refetch()
      return { status: response?.status, message: response?.data?.message };
    } catch (err) {
      console.log(err);
      return { status: err.status, message: "Falha ao recusar a proposta." };
    }
  };


  return {
    data,
    error,
    isLoading,
    deleteOrder,
    refetch,
    aprove,
    refuse,
    aprovacaoProposta,
    colorAprovacaoProposta,
    elaborate,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    formFilter,
    deleteOrderAndNavigate,
    isDeleting,
    statusColor,
    statusString,
    sendProposolByEmail,
    removeInstrumentProposal,
    isRemoving
  };
};

export default useOrders;
