import { useQuery } from 'react-query';
import {axios} from '../api'

const useProcedimentos = (id) => {
    const { data, error, isLoading, refetch } = useQuery(['procedimentos', id], async () => {
        if (id) {
          const response = await axios.get(`/procedimentos/${id}`, { params: { page_size: 9999 } });
          return response?.data;
        }
        const response = await axios.get('/procedimentos', { params: { page_size: 9999 } });
        return response?.data?.results;
      });

    return {
        data
    }
    
}

export default useProcedimentos;