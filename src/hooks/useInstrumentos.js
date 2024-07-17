import debounce from 'lodash.debounce';
import { useMemo, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { isExpired } from '../utils/formatTime';
import { axios } from '../api';

const useInstrumentos = (id, cliente) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const queryClient = useQueryClient()
  const { data, error, isLoading, refetch } = useQuery(['instrumentos', id, debouncedSearch, cliente?.id], async () => {
    if (id) {
      const response = await axios.get(`/instrumentos/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/instrumentos', { params: { page_size: 9999, search: debouncedSearch, client: cliente?.id } });
    return response?.data?.results;
  });

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
    return data?.filter((instrumento) =>
      isExpired(instrumento?.data_ultima_calibracao, instrumento?.frequencia)
    );
  }, [id, data]);

  const instrumentosCalibrados = useMemo(() => {
    if (id) {
      return null;
    }
    return data?.filter(
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

  const updatePrice = async ({id, price}) => {
    const response = await axios.patch(`/instrumentos/${id}/`, { preco_alternativo_calibracao: price });
    return response.data;
  }

  const { mutate: mutatePrice } = useMutation({
    mutationFn: updatePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] })
    },
  })

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
  };
};

export default useInstrumentos;
