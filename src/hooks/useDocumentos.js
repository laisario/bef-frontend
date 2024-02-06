import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import {axios} from '../api'

const useDocumentos = (id, {page = 0, rowsPerPage = 5} = {}) => {
  const { data, error, isLoading, refetch } = useQuery(['documentos', id, page, rowsPerPage], async () => {
    if (id) {
      const response = await axios.get(`/documentos/${id}`);
      return response?.data;
    }
    const response = await axios.get('/documentos', { params: { page: page + 1, page_size: rowsPerPage } });
    return response?.data;
  });

  const status = {
    'V': 'Vigente',
    'O': 'Obsoleto',
    'C': 'Cancelado'
  }

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
  }
}

export default useDocumentos;