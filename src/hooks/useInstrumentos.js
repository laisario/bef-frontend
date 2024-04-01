import debounce from 'lodash.debounce';
import { useMemo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { isExpired } from '../utils/formatTime';
import {axios} from '../api';

const useInstrumentos = (id) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { data, error, isLoading, refetch } = useQuery(['instrumentos', id, debouncedSearch], async () => {
    if (id) {
      const response = await axios.get(`/instrumentos/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/instrumentos', { params: { page_size: 9999, search: debouncedSearch } });
    return response?.data?.results;
  });

  const handleSearch = debounce((value) => setDebouncedSearch(value));

  useEffect(() => {handleSearch(search)}, [search])

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
      isExpired(instrumento?.data_ultima_calibracao, instrumento?.instrumento.tipo_de_instrumento.frequencia)
    );
  }, [data]);
  
  const instrumentosCalibrados = useMemo(() => {
    if (id) {
      return null;
    }
    return data?.filter(
      (instrumento) =>
        !isExpired(instrumento?.data_ultima_calibracao, instrumento?.instrumento.tipo_de_instrumento.frequencia)
    );
  }, [data]);

  const deleteInstrument = async () => {
    await axios.delete(`/instrumentos/${id}`);
    navigate('/dashboard/produtos');
  };

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
  };
};

export default useInstrumentos;
