import { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import debounce from 'lodash.debounce';
import { useForm, useWatch } from 'react-hook-form';
import { axios } from '../api';
import { isExpired } from '../utils/formatTime';

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
  const formCreate = useForm({
    defaultValues: {
      codigo: '',
      identificador: '',
      titulo: '',
      status: '',
      elaborador: '',
      frequencia: null,
      arquivo: null,
      dataValidade: '',
      dataRevisao: '',
    }
  })
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


  const findCriticalAnalysisStage = (criticalAnalysis) => {
    let color = ''
    if (criticalAnalysis > 30) {
      color = 'success'
    } else if (criticalAnalysis < 1) {
      color = 'error'
    } else {
      color = 'warning'
    }
    return color
  }

  const criticalAnalysisMonths = (criticalAnalysis) => {
    if (criticalAnalysis < 30 && criticalAnalysis > 0) {
      return criticalAnalysis > 1 ? `${criticalAnalysis} dias` : `${criticalAnalysis} dia` 
    }
    const months = Math.floor(criticalAnalysis / 30)
    return months > 1 ? `${months} meses` : `${months} mês`
  }

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
    status,
    isLoading,
    refetch,
    deleteDocumento,
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
    formCreate,
    isError,
    findCriticalAnalysisStage,
    criticalAnalysisMonths,
  }
}

export default useDocumentos;