import { useQuery } from 'react-query'

const regexCep = /^[0-9]{8}$/;

export function validarCEP(value = '') {
    if (!value) return false
    const cep = value.replace(/\D/g, '');

    return regexCep.test(cep)
}

export function formatCNPJ(value = '') {
    const valid = validarCEP(value)

    if (!valid) return ''

    const cep = value.replace(/\D/g, '');

    const format = cep.replace(
        /(\d{5})(\d{3})/,
        '$1-$2',
    )

    return format
}

const useCEP = (cep) => {
    const { data, error, isLoading } = useQuery(['cep', cep], async () => {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        return response?.data
    }, {
        enabled: validarCEP(cep)
    })
  

    return {
        rua: data?.logradouro,
        bairro: data?.bairro,
        cidade: data?.localidade,
        estado: data?.uf
    }
}

export default useCEP