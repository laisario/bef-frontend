import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { isExpired } from '../utils/formatTime'
import axios from '../api'


const useInstrumentos = () => {
    const { data, error, isLoading } = useQuery(['instrumentos'], async () => {
        const response = await axios.get('/instrumentos', { params: { page_size: 9999 } })
        return response?.data
    })

    const instrumentosVencidos = useMemo(() => data?.filter(instrumento => isExpired(instrumento?.data_ultima_calibracao, instrumento?.frequencia)), [data])
    const instrumentosCalibrados = useMemo(() => data?.filter(instrumento => !isExpired(instrumento?.data_ultima_calibracao, instrumento?.frequencia)), [data])

    return {
        instrumentosVencidos,
        instrumentosCalibrados,
        todosInstrumentos: data,
        error,
        isLoading
    }
}

export default useInstrumentos