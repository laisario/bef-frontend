import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import debounce from 'lodash.debounce';
import {axios} from '../api';
import { isExpired } from '../utils/formatTime';

const useDocumentos = (id) => {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [search, setSearch] = useState('')
  const [openFormRevision, setOpenFormRevision] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data, error, isLoading, refetch } = useQuery(['documentos', id, page, rowsPerPage, debouncedSearch], async () => {
    if (id) {
      const response = await axios.get(`/documentos/${id}`);
      return response?.data
    }
    const response = await axios.get('/documentos', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch } });
    return response?.data
  });
  
  const handleSearch = debounce((value) => setDebouncedSearch(value));

  useEffect(() => {handleSearch(search)}, [search, handleSearch])
  
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };
  const documentosVencidos = useMemo(() => {
    if (id) {
      return null;
    }
    return data?.results?.filter((document) =>
      isExpired(document?.data_validade, document?.frequencia, "year")
    );
  }, [id, data]);

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
    openFormRevision, 
    setOpenFormRevision,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    documentosVencidos
  }
}

export default useDocumentos;