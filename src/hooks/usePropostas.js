import { useQuery } from 'react-query'
import axios from '../api'


const usePropostas = () => {
    const { data, error, isLoading } = useQuery(['propostas'], async () => {
        const response = await axios.get('/propostas', { params: { page_size: 9999 } })
        return response?.data
    })

    const getOrder = async (id) => {
        const response = await axios.get(`/propostas/${id}`)
        return response?.data
    }

    return {
        todasPropostas: data,
        error,
        isLoading,
        getOrder,
    }
}

export default usePropostas