import { useEffect, useState } from 'react';
// Styling
import './Table.scss';

const Table = (props) => {
    const {
        className = '',
        columnDefs = null,
        dataSource = [],
        firstColumnBorderRight = true,
    } = props;

    const classes = `cc-table ` + `${className ? className : ''}`;

    return columnDefs ? (
        <table className={classes}>
            <thead className="cc-table-header">
                <tr>
                    {columnDefs.map((x, index) => (
                        <th key={x.headerName + index}>{x.headerName}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="cc-table-body">
                {dataSource.map((data, indexRow) => (
                    <tr key={`row-${indexRow}`}>
                        {columnDefs.map((x, indexCell) => (
                            <td key={`cell-${indexRow}-${indexCell}`}>{data[x.field]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    ) : null;
};

export default Table;
