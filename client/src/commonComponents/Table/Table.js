import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
// Styling
import './Table.scss';

const Table = (props) => {
    const { className = '', columnDefs = null, dataSource = [] } = props;

    const [data, setData] = useState([...dataSource]);
    const [show, setShow] = useState(false);

    const classes = `cc-table ` + `${className ? className : ''}`;

    useEffect(() => {
        const hasSorting = columnDefs.filter((x) => x.comparator).map((x) => x.comparator);
        if (!isEmpty(hasSorting)) {
            let newArr = [...data];
            hasSorting.forEach((comp) => {
                newArr = newArr.sort(comp);
            });
            setData(newArr);
        }
        setShow(true);
    }, []);

    return columnDefs && show ? (
        <table className={classes}>
            <thead className="cc-table-header">
                <tr>
                    {columnDefs.map((x, index) => (
                        <th key={x.headerName + index}>{x.headerName}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="cc-table-body">
                {data.map((data, indexRow) => (
                    <tr key={`row-${indexRow}`}>
                        {columnDefs.map((x, indexCell) => (
                            <td key={`cell-${indexRow}-${indexCell}`}>
                                {x?.numered ? indexRow + 1 : data[x.field]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    ) : null;
};

export default Table;
