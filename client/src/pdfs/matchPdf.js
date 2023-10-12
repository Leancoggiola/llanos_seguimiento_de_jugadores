import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { capitalize, startCase } from 'lodash';

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
    },
];

const getHeaders = (doc, category) => {
    const width = Math.floor(doc.internal.pageSize.getWidth()) - 40;
    const head = [...headers];
    head[1].styles = { cellWidth: width * 0.2 };
    if (category === 'Veterano') {
        head[0].styles = { cellWidth: width * 0.28 };
        head.splice(2, 0, {
            content: 'DNI',
            colSpan: 1,
            styles: { cellWidth: width * 0.15 },
        });
        head.splice(3, 0, {
            content: 'EDAD',
            colSpan: 1,
            styles: { cellWidth: width * 0.09 },
        });
    }
    for (let i = category === 'Veterano' ? 4 : 2; i < head.length - 1; i++) {
        head[i].styles = { ...head[i].styles, cellWidth: 7 };
    }
    return head;
};

const getBody = (team, { week, details, date }, group, type, tourney, prevDoubleAmarilla) => {
    const { category } = tourney;
    let accDetails, validMatchs;

    if (type === 'grupo') {
        validMatchs = group.matchs.filter((m) => m.week <= week && m.teams.map((x) => x._id).includes(team._id) && m.teams.every((x) => x._id));
        accDetails = validMatchs.flatMap((x) => removeDuplicatedAmarillas(x.details));
    } else if (type === 'eliminatoria') {
        // Get all matchs on groups with that team
        validMatchs = tourney.groups.flatMap((x) => x.matchs).filter((x) => x.teams.map((x) => x._id).includes(team._id));
        validMatchs = [
            ...validMatchs,
            ...tourney.knockout
                .filter((x) => x.order <= group.order)
                .flatMap((x) => x.matchs)
                .filter((x) => x.teams.map((x) => x._id).includes(team._id)),
        ];
        accDetails = validMatchs.flatMap((x) => removeDuplicatedAmarillas(x.details));
    }

    const players = [];
    if (team.players.length) {
        team.players.forEach((player) => {
            // Check Si tiene doble amarrilla partido anterior
            const hasDouble = validMatchs.find((x) => x.week === week - 1)?.details.filter((x) => player._id === x.player?._id && x.type === 'tarjeta amarilla')?.length === 2;

            hasDouble && prevDoubleAmarilla.push(player.name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));

            const data = [{ content: startCase(player.name), styles: { halign: 'left' } }, ''];
            if (category === 'Veterano') {
                data.push(player.dni);
                data.push(player.age);
            }

            // AMARILLAS TOTALES
            data.push(accDetails.filter((x) => player._id === x.player?._id && x.type === 'tarjeta amarilla').length);

            // AMARILLAS EN PARTIDO
            if (details.length) {
                const AP = details.filter((x) => player._id === x.player?._id && x.type === 'tarjeta amarilla')?.length;
                data.push(AP >= 1 ? 'X' : '');
                data.push(AP >= 2 ? 'X' : '');
            } else {
                data.push('', '');
            }

            // SANCIONES TOTALES
            data.push(getSanciones(validMatchs, player, date));

            // GOLES TOTALES
            data.push(accDetails.filter((x) => player._id === x.player?._id && x.type === 'gol').length);

            data.push('');

            players.push(data);
        });
    } else players.push([]);
    return players;
};

const generateMatchPdf = (match, group, tourney, type) => {
    const { name, category } = tourney;
    let prevDoubleAmarilla = [];
    const doc = new jsPDF();

    // TITULO
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(name, 104, 10, { align: 'center' });
    doc.line(105 - doc.getTextWidth(name) / 2, 11, 107 + doc.getTextWidth(name) / 2, 11);

    // EQUIPOS
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    match.teams.forEach((team, index) => {
        const finalY = doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY : 0;
        doc.text(`Equipo: ${capitalize(team.name)}`, 105, (index === 0 ? 20 : 15) + finalY, {
            align: 'center',
        });
        const textInit = 104 - doc.getTextWidth(`Equipo: ${capitalize(team.name)}`) / 2;
        doc.line(textInit, (index === 0 ? 21 : 16) + finalY, textInit + doc.getTextWidth(`Equipo:`), (index === 0 ? 21 : 16) + finalY);

        // TABLA
        autoTable(doc, {
            startY: (index === 0 ? 25 : 20) + finalY,
            margin: 10,
            styles: {
                valign: 'middle',
                halign: 'center',
                cellWidth: 'auto',
                fontSize: 10.5,
                cellPadding: 1.1,
                lineWidth: 0.1,
                lineColor: 100,
            },
            headStyles: {
                fillColor: null,
                textColor: 100,
            },
            theme: 'grid',
            head: [getHeaders(doc, category)],
            body: getBody(team, match, group, type, tourney, prevDoubleAmarilla),
            didParseCell: (data) => {
                const { row } = data;
                if (row.index > 0) {
                    const saOff = category !== 'Veterano' ? 5 : 7;
                    if (row.cells[saOff].raw > 0) {
                        data.cell.styles.fillColor = [241, 174, 181];
                    } else if (prevDoubleAmarilla.includes(row.cells[0].raw.content)) {
                        data.cell.styles.fillColor = [255, 218, 106];
                    }
                }
            },
        });
    });

    // OBSERVACIONES
    doc.setFont(undefined, 'bold');
    doc.text('Observaciones', 10, doc.lastAutoTable.finalY + 10);
    doc.save(`Partido ${match.teams[0].name}-${match.teams[1].name}.pdf`);
};

const getSanciones = (matchs, player, date = null) => {
    let sanction = 0;
    let matchsDates = matchs.filter((x) => x?.date).map((x) => new Date(x.date));
    if (date) {
        matchsDates = matchsDates.filter((x) => x !== new Date(date));
    }
    if (player?.initial_sanction) {
        sanction = matchsDates.reduce((prev, matchDate) => {
            if (prev !== 0) {
                prev = matchDate > new Date(player.sanction_date) ? prev - 1 : prev;
            }
            return prev;
        }, player.initial_sanction);
    }
    return sanction;
};

const removeDuplicatedAmarillas = (arr) => {
    const jugConAmarillas = arr.filter((x) => x.type === 'tarjeta amarilla').map((x) => x.player.name);
    let duplicates = jugConAmarillas.filter((item, index) => jugConAmarillas.indexOf(item) !== index);
    duplicates = Array.from(new Set(duplicates));

    return arr.filter((x) => !duplicates.includes(x.player.name));
};

export { generateMatchPdf };
