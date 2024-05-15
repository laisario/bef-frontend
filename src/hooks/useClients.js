import { useQuery } from 'react-query';
import {axios} from '../api';

function useClients(id) {
  const { data: clientes, error, isLoading, refetch } = useQuery(['clientes', id], async () => {
    if (id) {
      const response = await axios.get(`/clientes/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }
    const response = await axios.get('/clientes', { params: { page_size: 9999 } });
    return response?.data?.results;
  });
  console.log(`aaaaa`)
  return {
    clientes, 
    error,
    isLoading,
    refetch
  }
}

export default useClients;