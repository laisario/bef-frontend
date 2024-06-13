import { useEffect, useState } from 'react'
import { ExcelRenderer } from 'react-excel-renderer';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { useParams } from 'react-router-dom';
import useDocumentos from '../../hooks/useDocumentos';

function ExcelViewer() {
    const [table, setTable] = useState({
        cols: [],
        rows: [],
    });
    const { id } = useParams();
    const { data } = useDocumentos(id);
    useEffect(() => {
        (async () => {
            const file = await (await fetch(data?.arquivo)).blob()
            ExcelRenderer(file, (err, resp) => {
                if (err) {
                    console.log(err);
                }
                else {
                    setTable({
                        cols: resp.cols,
                        rows: resp.rows
                    });
                }
            });
        })()

    }, [data?.arquivo])

    const rowKeyGetter = (row) => row.id;

    return (
        <DataGrid columns={table.cols} rows={table.rows} className='rdg-light' rowKeyGetter={rowKeyGetter} rowHeight={25} style={{ "height": "750px" }} />
    )
}

export default ExcelViewer;