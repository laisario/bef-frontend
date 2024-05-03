import { useQuery } from 'react-query';
import { axios } from '../api'

const useCalibrations = (id) => {
  const { data, error, isLoading, refetch } = useQuery(['calibracoes', id], async () => {
    if (id) {
      const response = await axios.get(`/calibracoes/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/calibracoes', { params: { page_size: 9999 } });
    return response?.data?.results;
  });



  return {
    data,
    error,
    isLoading,
    refetch,
  }
}

export default useCalibrations;