import debounce from 'lodash.debounce';
import { useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { isExpired } from '../utils/formatTime';
import { axios } from '../api';

const useInstrumentos = (id, cliente, pageSize = 8) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const queryClient = useQueryClient()
  const { data, error, isLoading, refetch } = useQuery(['instrumentos', id, debouncedSearch, cliente?.id, page, rowsPerPage], async () => {
    if (id) {
      const response = await axios.get(`/instrumentos/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/instrumentos', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch, client: cliente?.id } });
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

  const {
    data: instrumentosEmpresa,
    error: errorInstrumentosEmpresa,
    isLoading: isLoadingInstrumentosEmpresa,
  } = useQuery(['instrumentos-empresa'], async () => {
    const response = await axios.get('/instrumentos-empresa', { params: { page_size: 9999 } });
    return response?.data?.results;
  });

  const instrumentosVencidos = useMemo(() => {
    if (id) {
      return null;
    }
    return data?.results?.filter((instrumento) =>
      isExpired(instrumento?.data_ultima_calibracao, instrumento?.frequencia)
    );
  }, [id, data]);

  const instrumentosCalibrados = useMemo(() => {
    if (id) {
      return null;
    }
    return data?.results?.filter(
      (instrumento) =>
        !isExpired(instrumento?.data_ultima_calibracao, instrumento?.frequencia)
    );
  }, [id, data]);

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

  const updatePrice = async ({ id, price }) => {
    const response = await axios.patch(`/instrumentos/${id}/`, { preco_alternativo_calibracao: price });
    return response.data;
  }

  const { mutate: mutatePrice } = useMutation({
    mutationFn: updatePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })

  const localLabels = {
    "P": "Instalações permanentes",
    "C": "Instalações cliente",
    "T": "Terceirizado"
  }

  const positionLabels = {
    "U": "Em uso",
    "E": "Em estoque",
    "I": "Inativo",
    "F": "Fora de uso"
  }

  return {
    instrumentosVencidos,
    instrumentosCalibrados,
    todosInstrumentos: data,
    error,
    isLoading,
    deleteInstrument,
    instrumentosEmpresa,
    errorInstrumentosEmpresa,
    isLoadingInstrumentosEmpresa,
    refetch,
    search,
    setSearch,
    mutate,
    mutatePrice,
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    localLabels,
    positionLabels,
  };
};

export default useInstrumentos;
