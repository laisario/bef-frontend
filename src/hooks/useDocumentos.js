import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import debounce from 'lodash.debounce';
import {axios} from '../api';

const useDocumentos = (id, {page = 0, rowsPerPage = 5} = {}) => {
  const [search, setSearch] = useState('')
  const [documentos, setDocumentos] = useState([])
  const { data, error, isLoading, refetch } = useQuery(['documentos', id, page, rowsPerPage], async () => {
    if (id) {
      const response = await axios.get(`/documentos/${id}`);
      return response?.data
    }
    const response = await axios.get('/documentos', { params: { page: page + 1, page_size: rowsPerPage } });
    return response?.data
  });

  useEffect(() => {
      const debouncedSave = debounce(async() => {
        const response = await axios.get(`/documentos?search=${search}`);
        setDocumentos(response?.data?.results)

      }, 500);
		  debouncedSave();
   
  }, [search])

  const status = {
    'V': 'Vigente',
    'O': 'Obsoleto',
    'C': 'Cancelado'
  }

  const statusColor = {
    'O': 'info',
    'C': 'error',
    'V': 'success',
  };

  const { mutate: deleteDocumento, isLoading: isDeleting } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/documentos/${id}`))), {
    onSuccess: () => {
      refetch()
    },
   })

  return {
    data,
    error,
    isLoading,
    refetch,
    status,
    deleteDocumento,
    isDeleting,
    statusColor,
    search,
    setSearch,
    documentos,
  }
}

export default useDocumentos;