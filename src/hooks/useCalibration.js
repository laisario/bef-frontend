import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { axios, axiosForFiles } from '../api'

const useCalibrations = (id, instrumento) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery(['calibracoes', debouncedSearch, instrumento, id], async () => {
    if (id) {
      const response = await axios.get(`/calibracoes/${id}`, { params: { page_size: 9999 } });
      return response?.data;
    }

    const response = await axios.get('/calibracoes', { params: { page_size: 9999, ordem_de_servico: debouncedSearch, instrumento } });
    return response?.data?.results;
  });

  const handleSearchOS = debounce((value) => setDebouncedSearch(value));
  useEffect(() => { handleSearchOS(search) }, [search, handleSearchOS])

  const deleteClibration = async (idCalibration) => {
    await axios.delete(`/calibracoes/${idCalibration}`);
  };

  const {
    mutate: mutateDeleteCalibration,
    isLoading: isDeletingCalibration,
    isSuccess: isSuccessDelete,
    isError: isErrorDelete,
  } = useMutation({
    mutationFn: deleteClibration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] })
    },
  })


  const formatedData = (form) => ({
    local: form?.local,
    data: form?.data && dayjs(form?.data)?.format('YYYY-MM-DD'),
    ordem_de_servico: form?.ordemDeServico,
    observacoes: form?.observacoes,
    maior_erro: form?.maiorErro,
    incerteza: form?.incerteza,
    criterio_de_aceitacao: form?.criterioDeAceitacao,
    referencia_do_criterio: form?.referenciaDoCriterio
  })

  const create = async (params) => {
    const data = formatedData(params?.form)
    const response = await axios.post(`/calibracoes/`, { ...data, instrumento });
    return response.data;
  }

  const {
    mutate: mutateCriation,
    isLoading: isLoadingCreation,
    error: errorCreating,
    isSuccess: isSuccessCreate,
    isError: isErrorCreate,
  } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] })
    },
  })


  const edit = async (params) => {
    const data = formatedData(params?.form)
    const response = await axios.patch(`/calibracoes/${params?.id}/`, { ...data, instrumento });
    return response.data;
  }

  const {
    mutate: mutateEdit,
    isLoading: isLoadingEdit,
    isSuccess: isSuccessEdit,
    isError: isErrorEdit
  } = useMutation({
    mutationFn: edit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] })
      queryClient.invalidateQueries({ queryKey: ['instrumentos'] })
    },
  })

  const addCertificate = async (params) => {
    const { data: { id: certificadoId } } = await axiosForFiles.post(`/calibracoes/${params?.id}/adicionar_certificado/`, { arquivo: params?.arquivo, numero: params?.numero })
    params?.anexos.forEach(async anexo => {
      const formData = new FormData()
      formData.append('anexo', anexo?.anexo)
      formData.append('certificado', certificadoId)
      await axiosForFiles.patch(`/calibracoes/anexar/`, formData)
    })
    return certificadoId;
  }

  const {
    mutate: mutateAddCertificate,
    isLoading: isLoadingAddCertificate,
    data: dataAddCertificate,
    isSuccess: isSuccesAddCertificate,
    isError: isErrorAddCertificate,
  } = useMutation({
    mutationFn: addCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] })
    },
  })

  const deleteCertificate = async (params) => {
    await axios.post(`/calibracoes/${params?.id}/apagar_certificado/`, { id: params?.idCertificado })
  }

  const {
    mutate: mutateDeleteCertificate,
    isLoading: isLoadingDeleteCertificate,
    isSuccess: isSuccesDeleteCertificate,
    isError: isErrorDeleteCertificate,
  } = useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calibracoes'] })
    },
  })

  return {
    data,
    error,
    isLoading,
    refetch,
    search,
    setSearch,
    errorCreating,
    mutateDeleteCalibration,
    mutateCriation,
    mutateEdit,
    mutateAddCertificate,
    mutateDeleteCertificate,
    isDeletingCalibration,
    isLoadingCreation,
    isLoadingEdit,
    isLoadingAddCertificate,
    isLoadingDeleteCertificate,
    dataAddCertificate,
    isSuccessEdit,
    isSuccessDelete,
    isSuccessCreate,
    isSuccesAddCertificate,
    isSuccesDeleteCertificate,
    isErrorAddCertificate,
    isErrorDeleteCertificate,
    isErrorCreate,
    isErrorDelete,
    isErrorEdit
  }
}

export default useCalibrations;