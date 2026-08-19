// Parsowanie CSV z arkusza i agregacja per CV - używane zarówno przez server.js (na żywo,
// gdy appka jest hostowana z prawdziwym backendem), jak i scripts/build-sheet-data.js
// (generuje statyczny public/data/sheet-data.json na potrzeby wersji demo na GitHub Pages).

const DESIGN_CRITERIA = ['Przejrzystość tekstu', 'Transparentność wizualna', 'Kolorystyka', 'Kompozycja'];

// Prosty parser CSV obsługujący pola w cudzysłowach (przecinki/średniki/nowe linie w środku).
function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else { inQuotes = false; }
            } else {
                field += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ',') {
            row.push(field); field = '';
        } else if (c === '\r') {
            // pomijamy - obsłużone razem z \n
        } else if (c === '\n') {
            row.push(field); rows.push(row); row = []; field = '';
        } else {
            field += c;
        }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(cell => cell !== ''));
}

// Agreguje surowe wiersze arkusza (wszystkie sesje wszystkich graczy) per CV:
// średnie oceny, liczba opinii, decyzje, i statystyki plus/minus/to zależy per temat.
function aggregateSheetRows(rows) {
    if (rows.length < 2) return [];

    const header = rows[0];
    const idx = (name) => header.indexOf(name);
    const iCvId = idx('CV ID');
    const iName = idx('Kandydat');
    const iDecision = idx('Decyzja');
    const iCriteria = DESIGN_CRITERIA.map(idx);
    const iPlus = idx('Plusy');
    const iMinus = idx('Minusy');
    const iDepends = idx('To zależy');

    if (iCvId === -1) return [];

    const candidates = {};

    for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const cvId = row[iCvId];
        if (!cvId) continue;

        if (!candidates[cvId]) {
            candidates[cvId] = {
                cvId,
                name: row[iName] || `CV #${cvId}`,
                opinions: 0,
                hireCount: 0,
                rejectCount: 0,
                criteriaSum: DESIGN_CRITERIA.map(() => 0),
                criteriaCount: DESIGN_CRITERIA.map(() => 0),
                tags: {}
            };
        }
        const c = candidates[cvId];
        c.opinions++;
        if (row[iDecision] === 'Zatrudniono') c.hireCount++;
        else if (row[iDecision] === 'Odrzucono') c.rejectCount++;

        iCriteria.forEach((colIdx, i) => {
            const v = parseFloat(row[colIdx]);
            if (!Number.isNaN(v)) { c.criteriaSum[i] += v; c.criteriaCount[i]++; }
        });

        const addTags = (colIdx, key) => {
            const val = colIdx === -1 ? '' : row[colIdx];
            if (!val) return;
            val.split(';').map(s => s.trim()).filter(Boolean).forEach(tag => {
                if (!c.tags[tag]) c.tags[tag] = { plus: 0, minus: 0, depends: 0 };
                c.tags[tag][key]++;
            });
        };
        addTags(iPlus, 'plus');
        addTags(iMinus, 'minus');
        addTags(iDepends, 'depends');
    }

    return Object.values(candidates).map(c => {
        const avgScores = {};
        let ovrSum = 0, ovrCount = 0;
        DESIGN_CRITERIA.forEach((name, i) => {
            const avg = c.criteriaCount[i] ? c.criteriaSum[i] / c.criteriaCount[i] : null;
            avgScores[name] = avg === null ? null : +avg.toFixed(2);
            if (avg !== null) { ovrSum += avg; ovrCount++; }
        });

        return {
            cvId: c.cvId,
            name: c.name,
            opinions: c.opinions,
            hireCount: c.hireCount,
            rejectCount: c.rejectCount,
            avgScores,
            avgOvr: ovrCount ? +(ovrSum / ovrCount).toFixed(2) : null,
            tags: c.tags
        };
    });
}

module.exports = { parseCsv, aggregateSheetRows, DESIGN_CRITERIA };
