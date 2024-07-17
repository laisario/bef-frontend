import { useState } from 'react';
import { useQuery } from 'react-query';
import { axios } from '../api';

function useRevision(id) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { data } = useQuery(['revisoes', id], async () => {
        if (id) {
            const response = await axios.get(`/revisoes/${id}`);
            return response?.data
        }
        const response = await axios.get('/revisoes', { params: { page: page + 1, page_size: rowsPerPage } });
        return response?.data
    });
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return ({
        data,
        handleChangePage,
        handleChangeRowsPerPage,
    })
}

export default useRevision