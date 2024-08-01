/* eslint-disable camelcase */
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
  const [pdfFile, setPDFFile] = useState(null);
  const formFilter = useForm({
    defaultValues: {
      search: "",
      status: "",
      dateStart: "",
      dateStop: "",
      filterByDate: false,
    }
  })
  const [debouncedSearchFilter, setDebouncedSearchFilter] = useState('')

  const {
    search,
    status,
    dateStart,
    dateStop,
    filterByDate
  } = useWatch({ control: formFilter.control })
  const queryClient = useQueryClient()
  const { data, error, isLoading, refetch } = useQuery(['propostas', id, page, rowsPerPage, debouncedSearchFilter, status, filterByDate], async () => {
    if (id) {
      const response = await axios.get(`/propostas/${id}`, { params: { page_size: rowsPerPage } });
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
    navigate('/admin/propostas');
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleDownloadProposol = async () => {
    const response = await getProposolPDF()
    if (response?.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response?.data], { type: 'application/pdf' }));
      setPDFFile(url)
    } else {
      setPDFFile(null)
    }

  }

  useEffect(() => {
    (async () => handleDownloadProposol())()
  }, [])


  const elaborate = async (form, setResponseStatus, setOpenAlert, editProposol) => {
    const formValues = form.watch()
    const formatDayjs = (date) => dayjs.isDayjs(date) ? date.format('YYYY-MM-DD') : null;
    const commonData = {
      total: formValues.total || 0,
      condicaoDePagamento: formValues.formaDePagamento || null,
      transporte: formValues.transporte || null,
      numero: formValues.numeroProposta || 0,
      validade: formatDayjs(formValues.validade),
      status: formValues.status || null,
      prazoDePagamento: formatDayjs(formValues.prazoDePagamento),
      edit: editProposol,
      responsavel: formValues.responsavel,
    };
    try {
      if (formValues.anexo && formValues.anexo instanceof File) {
        const formData = new FormData();
        formData.append('anexo', formValues.anexo);
        await axiosForFiles.patch(`/propostas/${id}/anexar/`, formData)
      }
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
      setResponseStatus({ status: response?.status, message: response?.data?.message });
      handleDownloadProposol()
    } catch (error) {
      console.log(error)
      setResponseStatus({ status: error?.response?.status, message: "Ocorreu um erro ao elaborar a proposta, verifique se preencheu corretamente." });
    }
    setOpenAlert(true);
    refetch()
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
  const propostasEmAnalise = useMemo(
    () => (Array.isArray(data?.results) ? data?.results?.filter((pedido) => pedido.status === 'E') : null),
    [data]
  );

  const propostasAprovar= useMemo(
    () => (Array.isArray(data?.results) ? data?.results?.filter((pedido) => pedido.status === 'AA') : null),
    [data]
  );

  const getProposolPDF = async () => {
    try {
      if (!id) {
        return null
      }
      const response = await axios.get(`/propostas-files/${id}`, {
        responseType: 'blob',
      });
      return response

    } catch (error) {
      return { status: error?.response?.status, message: "Falha ao recuperar PDF da proposta." };
    }
  }

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
    propostasEmAnalise,
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
    getProposolPDF,
    handleDownloadProposol,
    pdfFile,
    propostasAprovar,
  };
};

export default useOrders;
