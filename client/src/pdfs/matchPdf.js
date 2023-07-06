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
        content: 'AT',
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
        content: 'A',
        colSpan: 1,
        styles: {
            fillColor: [255, 218, 106],
        },
    },
    {
        content: 'S',
        colSpan: 1,
        styles: {
            fillColor: [241, 174, 181],
        },
    },
    {
        content: 'GT',
        colSpan: 1,
    },
    {
        content: 'GOLES',
        colSpan: 4,
    },
];

const getHeaders = (doc, category) => {
    const width = Math.floor(doc.internal.pageSize.getWidth()) - 40;
    const head = [...headers];
    head[0].styles = { cellWidth: width * 0.33 };
    head[1].styles = { cellWidth: width * 0.2 };
    if (category === 'Veterano') {
        head.splice(2, 0, {
            content: 'DNI',
            colSpan: 1,
            styles: { cellWidth: width * 0.1 },
        });
        head.splice(3, 0, {
            content: 'EDAD',
            colSpan: 1,
            styles: { cellWidth: width * 0.07 },
        });
    }
    for (let i = category === 'Veterano' ? 4 : 2; i < head.length; i++) {
        head[i].styles = { ...head[i].styles, cellWidth: 7 };
    }
    return head;
};

const getBody = (team, details, group, totalHeaders) => {
    const players = [];
    if (team.players.length) {
        team.players.forEach((player) => {
            const data = [{ content: capitalize(player.name), styles: { halign: 'left' } }, ''];
            if (totalHeaders === 10) {
                data.push(player.dni);
                data.push(player.age);
            }
            if (details.length) {
                let detail;
                // AMARILLAS TOTALES
                detail = group.matchs.flatMap((x) => x.details).filter((x) => player._id === x.player?._id && x.type === 'tarjeta amarilla').length;
                data.push(detail);
                // AMARILLAS EN PARTIDO
                detail = details.filter((x) => player._id === x.player?._id && x.type === 'tarjeta amarilla')?.length;
                data.push(detail >= 1 ? 'X' : '');
                data.push(detail >= 2 ? 'X' : '');
                // SANCIONES TOTALES
                data.push(getSanciones(group.matchs, player));
                // GOLES TOTALES
                detail = details.filter((x) => player._id === x.player?._id && x.type === 'gol')?.sort((a, b) => a.time_in_match - b.time_in_match);
                detail?.forEach((x) => {
                    data.push(x.type === 'gol' ? 'X' : 'C');
                });
                // RESTO
                if (!detail || detail?.length < 6) {
                    data.push(...Array.from({ length: 4 - detail?.length }, (_) => ''));
                }
            } else {
                data.push(group.matchs.flatMap((x) => x.details).filter((x) => player._id === x.player?._id && x.type === 'tarjeta amarilla').length);
                data.push('', '');
                data.push(getSanciones());
                data.push(details.filter((x) => player._id === x.player?._id && x.type === 'gol')?.sort((a, b) => a.time_in_match - b.time_in_match));
                data.push(...Array.from({ length: 4 }, (_) => ''));
            }
            players.push(data);
        });
    } else players.push([]);
    return players;
};

const generateMatchPdf = (match, group, category) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Torneo A', 104, 10, { align: 'center' });
    doc.line(105 - doc.getTextWidth('Torneo A') / 2, 11, 107 + doc.getTextWidth('Torneo A') / 2, 11);
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    match.teams.forEach((team, index) => {
        const finalY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 0;
        doc.text(`Equipo: ${capitalize(team.name)}`, 105, (index === 0 ? 20 : 15) + finalY, {
            align: 'center',
        });
        const textInit = 104 - doc.getTextWidth(`Equipo: ${capitalize(team.name)}`) / 2;
        doc.line(textInit, (index === 0 ? 21 : 16) + finalY, textInit + doc.getTextWidth(`Equipo:`), (index === 0 ? 21 : 16) + finalY);
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
            head: [getHeaders(doc, category)],
            body: getBody(team, match?.details, group, getHeaders(doc, category).length),
        });
    });
    doc.setFont(undefined, 'bold');
    doc.text('Observaciones', 10, doc.lastAutoTable.finalY + 10);
    doc.save(`Partido ${match.teams[0].name}-${match.teams[1].name}.pdf`);
};

const getSanciones = (matchs, player) => {
    let sanction = 0;
    const matchsDates = matchs.filter((x) => x?.date).map((x) => x.date);
    if (player?.initial_sanction) {
        sanction = matchsDates.reduce((prev, matchDate) => {
            if (prev !== 0) {
                prev = new Date(matchDate) > new Date(player.sanction_date) ? prev - 1 : prev;
            }
            return prev;
        }, player.initial_sanction);
    }
    return sanction;
};

export { generateMatchPdf };
