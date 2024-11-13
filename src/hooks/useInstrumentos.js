import debounce from 'lodash.debounce';
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { axios } from '../api';

const useInstrumentos = (id, cliente, pageSize = 8) => {
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

  const deleteInstrument = async (idInstrument) => {
    await axios.delete(`/instrumentos/${idInstrument}`);
  };

  const { mutate: mutateDelete, isLoading: isDeleting } = useMutation({
    mutationFn: deleteInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
    },
  })

  const sendCriticalAnalisys = async ({ idCalibration, analiseCliente }) => {
    const patchData = { analise_critica: analiseCliente?.criticalAnalysis }
    if (analiseCliente?.restrictions?.length) {
      patchData.restricao_analise_critica = analiseCliente?.restrictions
    }
    const response = await axios.patch(`/calibracoes/${idCalibration}/`, patchData);
    return response.data;

  }

  const { mutate: mutateCriticalAnalisys, isLoading: isLoadingCriticalAnalisys, isSuccess: isSuccessCriticalAnalisys } = useMutation({
    mutationFn: sendCriticalAnalisys,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
    },
  })

  const formatedData = (form) => ({
    tag: form?.tag,
    numero_de_serie: form?.numeroDeSerie,
    data_proxima_checagem: form?.dataProximaChecagem && dayjs(form?.dataProximaChecagem)?.format('YYYY-MM-DD'),
    data_ultima_calibracao: form?.dataUltimaCalibracao && dayjs(form?.dataUltimaCalibracao)?.format('YYYY-MM-DD'),
    local: form?.local,
    instrumento: {
      maximo: form?.maximo,
      minimo: form?.minimo,
      unidade: form?.unidade,
      preco_calibracao_no_laboratorio: form?.precoCalibracaoLaboratorio,
      preco_calibracao_no_cliente: form?.precoCalibracaoCliente,
      capacidade_de_medicao: {
        valor: form?.capacidadeMedicao,
        unidade: form?.unidadeMedicao,
      },
      tipo_de_instrumento: {
        descricao: form?.descricao,
        fabricante: form?.fabricante,
        modelo: form?.modelo,
        resolucao: form?.resolucao,
      },
      procedimento_relacionado: {
        codigo: form?.procedimentoRelacionado
      },
      tipo_de_servico: form?.tipoDeServico,
    },
    preco_alternativo_calibracao: form?.precoAlternativoCalibracao,
    dias_uteis: form?.diasUteis,
    pontos_de_calibracao: form?.pontosCalibracao?.length ? form?.pontosCalibracao?.map(ponto => ({ nome: ponto })) : [],
    posicao: form?.posicao,
    frequencia: form?.frequencia,
    laboratorio: form?.laboratorio,
    observacoes: form?.observacoes,
    cliente: form?.client,
  })




  const updateInstrument = async (form) => {
    const data = formatedData(form)
    const response = await axios.patch(`/instrumentos/${form?.instrumento}/`, data);
    return response;
  }

  const { mutate: mutateUpdate, isLoading: isUpdatingInstrument, isError: isErrorUp, isSuccess: isSuccessUp } = useMutation({
    mutationFn: updateInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })

  const createInstrument = async (form) => {
    const data = formatedData(form)

    const response = await axios.post(`/instrumentos/`, data);
    return response;
  }

  const { mutate: mutateCreate, isLoading: isCreating, isError: isErrorCreate, error: errorCreate, isSuccess: isSuccessCreate } = useMutation({
    mutationFn: createInstrument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
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
    mutateUpdate,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    isUpdatingInstrument,
    mutateDelete,
    isDeleting,
    mutateCreate,
    isCreating,
    isErrorUp,
    isErrorCreate,
    errorCreate,
    isSuccessCreate,
    isSuccessUp,
    mutateCriticalAnalisys,
    isLoadingCriticalAnalisys,
    isSuccessCriticalAnalisys,
  };
};

export default useInstrumentos;
