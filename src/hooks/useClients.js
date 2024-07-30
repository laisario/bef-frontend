import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { useMutation, useQuery } from 'react-query';
import {axios} from '../api';

function useClients(id) {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, error, isLoading, refetch } = useQuery(['clientes', id, page, rowsPerPage, debouncedSearch], async () => {
    if (id) {
      const response = await axios.get(`/clientes/${id}`);
      return response?.data;
    }
    const response = await axios.get('/clientes', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch } });
    return response?.data;
  });

  const formFilter = useForm({defaultValues: { search: ""}})
  const {
    search,
  } = useWatch({ control: formFilter.control })
  const handleSearch = debounce((search) => setDebouncedSearch(search));

  useEffect(() => { handleSearch(search) }, [search, handleSearch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { mutate: deleteClients, isLoading: isDeleting } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/clientes/${id}`))), {
    onSuccess: () => {
      refetch()
    },
  })

  return {
    data, 
    error,
    isLoading,
    refetch,
    formFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    deleteClients,
    isDeleting,
    rowsPerPage,
    page
  }
}

export default useClients;