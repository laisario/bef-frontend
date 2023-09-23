import { useEffect, useState } from 'react'
import consultarCNPJ from 'consultar-cnpj'


// Regex para validação de CPF
export const regexCPF = /^\d{3}.\d{3}.\d{3}-\d{2}$/

// Método de validação
// Referência: https://pt.wikipedia.org/wiki/Cadastro_de_pessoas_f%C3%ADsicas
export function validarCPF(value = '') {
    if (!value) return false

    // Aceita receber o valor como string, número ou array com todos os dígitos
    const isString = typeof value === 'string'
    const validTypes = isString || Number.isInteger(value) || Array.isArray(value)

    // Elimina valores com formato inválido
    if (!validTypes) return false

    // Filtro inicial para entradas do tipo string
    if (isString) {
        // Teste Regex para veificar se é uma string apenas dígitos válida
        const digitsOnly = /^\d{11}$/.test(value)
        // Teste Regex para verificar se é uma string formatada válida
        const validFormat = regexCPF.test(value)
        // Verifica se o valor passou em ao menos 1 dos testes
        const isValid = digitsOnly || validFormat

        // Se o formato não é válido, retorna inválido
        if (!isValid) return false
    }

    // Elimina tudo que não é dígito
    const numbers = matchNumbers(value)

    // Valida quantidade de dígitos
    if (numbers.length !== 11) return false

    // Elimina valores inválidos com todos os dígitos repetidos
    const items = [...new Set(numbers)]
    if (items.length === 1) return false

    // Separa número base do dígito verificador
    const base = numbers.slice(0, 9)
    const digits = numbers.slice(9)

    // Cálculo sobre o número base
    const calc0 = base
        .map((n, i) => baseCalc(n, i, numbers.length - 1))
        .reduce(sumCalc, 0)

    // 1o. dígito verificador
    const digit0 = digitCalc(calc0, numbers)

    // Valida 1o. digito verificador
    if (digit0 !== digits[0]) return false

    // Cálculo sobre o número base + 1o. dígito verificador
    const calc1 = base
        .concat(digit0)
        .map((n, i) => baseCalc(n, i, numbers.length))
        .reduce(sumCalc, 0)

    // 2o. dígito verificador
    const digit1 = digitCalc(calc1, numbers)

    // Valida 2o. dígito verificador
    return digit1 === digits[1]
}

// Método de formatação
export function formatCPF(value = '') {
    // Verifica se o valor é válido
    const valid = validarCPF(value)

    // Se o valor não for válido, retorna vazio
    if (!valid) return ''

    // Elimina tudo que não é dígito
    const numbers = matchNumbers(value)
    const text = numbers.join('')

    // Formatação do CPF: 999.999.999-99
    const format = text.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

    // Retorna o valor formatado
    return format
}

// Cálculo base
function baseCalc(n, i, x) {
    return n * (x - i)
}

// Utilitário de soma
function sumCalc(a, b) {
    return a + b
}

// Cálculo de dígito verificador
function digitCalc(n, numbers) {
    const rest = n % numbers.length
    return rest < 2 ? 0 : numbers.length - rest
}

// Elimina tudo que não é dígito
function matchNumbers(value = '') {
    const match = value.toString().match(/\d/g)
    return Array.isArray(match) ? match.map(Number) : []
}
