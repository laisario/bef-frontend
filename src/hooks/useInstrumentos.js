import { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { isExpired } from '../utils/formatTime';
import axios from '../api';

const useInstrumentos = (id) => {
  const [instrument, setInstrument] = useState()
  const navigate = useNavigate()
  const { data, error, isLoading } = useQuery(['instrumentos'], async () => {
    const response = await axios.get('/instrumentos', { params: { page_size: 9999 } });
    return response?.data;
  });

  const { data: instrumentosEmpresa, error: errorInstrumentosEmpresa, isLoading: isLoadingInstrumentosEmpresa } = useQuery(['instrumentos-empresa'], async () => {
    const response = await axios.get('/instrumentos-empresa', { params: { page_size: 9999 } });
    return response?.data;
  });

  const instrumentosVencidos = useMemo(
    () =>
      data?.filter((instrumento) =>
        isExpired(instrumento?.data_ultima_calibracao, instrumento?.instrumento.tipo_de_instrumento.frequencia)
      ),
    [data]
  );
  const instrumentosCalibrados = useMemo(
    () =>
      data?.filter(
        (instrumento) =>
          !isExpired(instrumento?.data_ultima_calibracao, instrumento?.instrumento.tipo_de_instrumento.frequencia)
      ),
    [data]
  );

  const getInstrument = async () => {
    const response = await axios.get(`/instrumentos/${id}`);
    return response?.data;
  };

  const deleteInstrument = async () => {
    await axios.delete(`/instrumentos/${id}`);
    // await refetch();
    navigate('/dashboard/=produtos')
  };

  useEffect(() => {
    (async () => {
      const response = await getInstrument();
      setInstrument(response);
    })();
  }, []);


  return {
    instrumentosVencidos,
    instrumentosCalibrados,
    todosInstrumentos: data,
    error,
    isLoading,
    instrument,
    deleteInstrument,
    instrumentosEmpresa,
    errorInstrumentosEmpresa,
    isLoadingInstrumentosEmpresa
  };
};

export default useInstrumentos;
