import debounce from 'lodash.debounce';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { axios } from '../api';

const useInstrumentos = (id, cliente, pageSize = 8) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const queryClient = useQueryClient()

  const { data, error, isLoading, refetch } = useQuery(['instrumentos', id, debouncedSearch, cliente, page, rowsPerPage], async () => {
    if (id) {
      const response = await axios.get(`/instrumentos/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/instrumentos', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch, client: cliente } });
    return response?.data;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = debounce((value) => setDebouncedSearch(value));

  useEffect(() => { handleSearch(search) }, [search, handleSearch])



  const deleteInstrument = async () => {
    await axios.delete(`/instrumentos/${id}`);
    navigate('/dashboard/instrumentos');
  };

  const update = async ({ idCalibration, analiseCliente }) => {
    const patchData = { analise_critica: analiseCliente?.criticalAnalysis }
    if (analiseCliente?.restrictions?.length) {
      patchData.restricao_analise_critica = analiseCliente?.restrictions
    }
    const response = await axios.patch(`/calibracoes/${idCalibration}/`, patchData);
    return response.data;

  }

  const { mutate } = useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
    },
  })

  const updateInstrument = async (form) => {
    const modifiedData = {
      tag: form?.tag,
      numero_de_serie: form?.numeroDeSerie,
      data_ultima_calibracao: form?.dataUltimaCalibracao && dayjs(form?.dataUltimaCalibracao)?.format('YYYY-MM-DD'),
      local: form?.local,
      instrumento: {
        maximo: form?.maximo,
        minimo: form?.minimo,
        unidade: form?.unidade,
        preco_calibracao_no_laboratorio: form?.precoCalibracao,
        preco_calibracao_no_cliente: form?.precoCalibracao,
        capacidade_de_medicao: {
          valor: form?.capacidadeMedicao,
          unidade: form?.unidadeMedicao,
        },
      },
      preco_alternativo_calibracao: form?.precoAlternativoCalibracao,
      dias_uteis: form?.diasUteis,
      pontos_de_calibracao: form?.pontosCalibracao?.length ? form?.pontosCalibracao?.map(ponto => ({ nome: ponto })) : [],
      posicao: form?.posicao,
    }

    const response = await axios.patch(`/instrumentos/${id}/`, modifiedData);
    return response.data;
  }

  const { mutate: mutateInstrument, isLoading: isUpdatingInstrument } = useMutation({
    mutationFn: updateInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })


  return {
    todosInstrumentos: data,
    error,
    isLoading,
    deleteInstrument,
    refetch,
    search,
    setSearch,
    mutate,
    mutateInstrument,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    isUpdatingInstrument
  };
};

export default useInstrumentos;
