import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize } from 'lodash';

const headers = [
    {
        content: 'JUGADOR',
        colSpan: 1,
    },
    {
        content: 'FIRMA',
        colSpan: 1,
    },
    {
        content: 'A',
        colSpan: 1,
        styles: {
            fillColor: [255, 218, 106],
        },
    },
    {
        content: 'A',
        colSpan: 1,
        styles: {
            fillColor: [255, 218, 106],
        },
    },
    {
        content: 'R',
        colSpan: 1,
        styles: {
            fillColor: [241, 174, 181],
        },
    },
    {
        content: 'GOLES',
        colSpan: 6,
    },
];

const getHeaders = (doc) => {
    const width = Math.floor(doc.internal.pageSize.getWidth()) - 40;
    headers[0].styles = { cellWidth: width * 0.45 };
    headers[1].styles = { cellWidth: width * 0.25 };
    for (let i = 2; i < headers.length; i++) {
        headers[i].styles = { ...headers[i].styles, cellWidth: 7 };
    }
    return headers;
};

const getBody = (team, details) => {
    const players = [];
    if (team.players.length) {
        team.players.forEach((player) => {
            const data = [{ content: capitalize(player.name), styles: { halign: 'left' } }, ''];
            if (details.length) {
                let detail = details.filter(
                    (x) => player._id === x.player._id && x.type === 'tarjeta amarilla'
                )?.length;
                data.push(detail >= 1 ? 'X' : '');
                data.push(detail >= 2 ? 'X' : '');
                detail = details.filter(
                    (x) => player._id === x.player._id && x.type === 'tarjeta roja'
                )?.length;
                data.push(detail === 1 ? 'X' : '');
                detail = details
                    .filter(
                        (x) =>
                            player._id === x.player._id &&
                            (x.type === 'gol' || x.type === 'autogol')
                    )
                    ?.sort((a, b) => a.time_in_match - b.time_in_match);
                detail?.forEach((x) => {
                    data.push(x.type === 'gol' ? 'X' : 'C');
                });
                if (!detail || detail?.length < 6) {
                    data.push(...Array.from({ length: 6 - detail?.length }, (_) => ''));
                }
            } else {
                data.push(...Array.from({ length: 9 }, (_) => ''));
            }
            players.push(data);
        });
    } else players.push([]);
    return players;
};

const generateMatchPdf = (match) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Torneo A', 104, 10, { align: 'center' });
    doc.line(
        105 - doc.getTextWidth('Torneo A') / 2,
        11,
        107 + doc.getTextWidth('Torneo A') / 2,
        11
    );
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    match.teams.forEach((team, index) => {
        const finalY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 0;
        doc.text(`Equipo: ${capitalize(team.name)}`, 105, (index === 0 ? 20 : 15) + finalY, {
            align: 'center',
        });
        const textInit = 104 - doc.getTextWidth(`Equipo: ${capitalize(team.name)}`) / 2;
        doc.line(
            textInit,
            (index === 0 ? 21 : 16) + finalY,
            textInit + doc.getTextWidth(`Equipo:`),
            (index === 0 ? 21 : 16) + finalY
        );
        autoTable(doc, {
            startY: (index === 0 ? 25 : 20) + finalY,
            styles: {
                valign: 'middle',
                halign: 'center',
                cellWidth: 'auto',
                fontSize: 8,
                cellPadding: 1.5,
                lineWidth: 0.1,
                lineColor: 100,
            },
            headStyles: {
                fillColor: null,
                textColor: 100,
            },
            theme: 'grid',
            head: [getHeaders(doc)],
            body: getBody(team, match?.details),
        });
    });
    doc.setFont(undefined, 'bold');
    doc.text('Observaciones', 10, doc.lastAutoTable.finalY + 10);
    doc.save(`Partido ${match.teams[0].name}-${match.teams[1].name}.pdf`);
};

export { generateMatchPdf };
