import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import debounce from 'lodash.debounce';
import { useForm, useWatch } from 'react-hook-form';

import { axios, axiosForFiles } from '../api';
import { isPastFromToday } from '../utils/formatTime';

const useDocumentos = (id) => {
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [openFormRevision, setOpenFormRevision] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const formFilter = useForm({
    defaultValues: {
      search: "",
      status: "",
    }
  })

  const {
    search,
    status: statusFilter,
  } = useWatch({ control: formFilter.control })

  const queryClient = useQueryClient()

  const { data, error, isLoading, refetch, isError } = useQuery(['documentos', id, page, rowsPerPage, debouncedSearch, statusFilter], async () => {
    if (id) {
      const response = await axios.get(`/documentos/${id}`);
      return response?.data
    }
    const response = await axios.get('/documentos', { params: { page: page + 1, page_size: rowsPerPage, search: debouncedSearch, status: statusFilter } });
    return response?.data
  });

  const handleSearch = debounce((value) => setDebouncedSearch(value));

  useEffect(() => { handleSearch(search) }, [search, handleSearch])

  const create = async (form) => {
    const response = await axios.post('/documentos/', {
      codigo: form?.codigo,
      identificador: form?.identificador,
      titulo: form?.titulo,
      status: form?.status,
      data_revisao: form?.data_revisao,
      data_validade: form?.data_validade,
      criador: form?.criador,
      frequencia: form?.frequencia,
    });
    if (response?.data?.id) {
      const formData = new FormData()
      formData.append("arquivo", form?.arquivo)
      await axiosForFiles.patch(`/documentos/${response?.data?.id}/anexar/`, formData)
    }
    return response
  }

  const { mutate: mutateCreate, isLoading: isCreating, isError: isErrorCreate, isSuccess: isSuccessCreate, error: errorCreate } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
    },
  })

  const createRevision = async (form) => {
    const response = await axios.post(`/documentos/${id}/revisar/`, {
      alteracao: form?.alteracao,
      aprovadores: form?.aprovadores,
    });
    if (response?.data?.revisao_id) {
      const formData = new FormData()
      formData.append("arquivo", form?.arquivo)
      await axiosForFiles.patch(`/documentos/${id}/alterar_anexo/`, formData)
    }
    return response
  }

  const { mutate: mutateCreateRevision, isLoading: isCreatingRevision, isError: isErrorCreateRevision, isSuccess: isSuccessCreateRevision, error: errorCreateRevision } = useMutation({
    mutationFn: createRevision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
    },
  })


  const status = {
    'V': 'Vigente',
    'O': 'Obsoleto',
    'C': 'Cancelado'
  }


  const statusColor = {
    'O': 'warning',
    'C': 'error',
    'V': 'success',
  };


  const { mutate: deleteDocumentos, isLoading: isDeleting } = useMutation(async (ids) => Promise.all(ids?.map((id) => axios.delete(`/documentos/${id}`))), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
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
      isPastFromToday(document?.data_validade)
    );
  }, [id, data]);
  return {
    data,
    error,
    status,
    isLoading,
    refetch,
    deleteDocumentos,
    isDeleting,
    statusColor,
    openFormRevision,
    setOpenFormRevision,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    documentosVencidos,
    formFilter,
    isError,
    mutateCreate,
    isCreating,
    isSuccessCreate,
    isErrorCreate,
    errorCreate,
    mutateCreateRevision,
    isCreatingRevision,
    isSuccessCreateRevision,
    isErrorCreateRevision,
    errorCreateRevision,
  }
}

export default useDocumentos;