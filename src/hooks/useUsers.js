import { useQuery } from 'react-query';
import {axios} from '../api'

const useUsers = (id) => {
    const { data, error, isLoading, refetch } = useQuery(['users', id], async () => {
        if (id) {
          const response = await axios.get(`/users/${id}`, { params: { page_size: 9999 } });
          return response?.data;
        }
        const response = await axios.get('/users', { params: { page_size: 9999 } });
        return response?.data?.results;
      });

    return {
        data, 
        error,
        isLoading,
        refetch,
    }
}

export default useUsers;