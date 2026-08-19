// EXTRACT + TRANSFORM + LOAD (jako plik statyczny) dla wersji demo hostowanej na GitHub Pages.
// GitHub Pages serwuje tylko gotowe pliki - nie ma jak wykonać kodu przy każdym żądaniu tak jak
// robi to server.js. Zamiast tego ten skrypt (uruchamiany cyklicznie przez
// .github/workflows/pages.yml) ściąga arkusz Google, agreguje go i zapisuje wynik jako
// public/data/sheet-data.json - dokładnie w tym samym kształcie co odpowiedź /sheet-data z
// server.js, więc analysis.html i summary.html czytają go bez żadnych zmian w logice.

const fs = require('fs');
const path = require('path');
const { parseCsv, aggregateSheetRows } = require('../sheet-aggregate');

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1FMG7MkoP8pTl_anjl8yLKLn4PPWU7ab_2qKDRBkwly0';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'sheet-data.json');

async function main() {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Arkusz zwrócił status ${response.status}`);

    const csvText = await response.text();
    const rows = parseCsv(csvText);
    const candidates = aggregateSheetRows(rows);

    const payload = {
        status: 'success',
        candidates,
        generatedAt: new Date().toISOString()
    };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));
    console.log(`✅ Zapisano ${candidates.length} CV do ${OUTPUT_PATH}`);
}

main().catch(err => {
    console.error('❌ Błąd generowania statycznych danych:', err.message);
    process.exit(1);
});
