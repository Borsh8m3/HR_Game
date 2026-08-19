require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
const { parseCsv, aggregateSheetRows } = require('./sheet-aggregate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/analyze', (req, res) => {
    const { x_coords, y_coords } = req.body;
    const numPoints = x_coords ? x_coords.length : 0;

    console.log(`Odebrano paczkę danych! Liczba punktów: ${numPoints}`);

    res.json({
        status: "success",
        message: `Przeanalizowano ${numPoints} punktów.`
    });
});

function csvEscape(value) {
    const str = String(value ?? '');
    if (/[",\n]/.test(str)) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function buildResultsCsv(sessionResults, sessionDate) {
    const header = ['Data sesji', 'CV ID', 'Kandydat', 'Decyzja', 'Pytanie 1', 'Pytanie 2', 'Pytanie 3', 'Przejrzystość tekstu', 'Transparentność wizualna', 'Kolorystyka', 'Kompozycja', 'Plusy', 'Minusy', 'To zależy', 'Śledzenie wzroku', 'Liczba punktów wzroku'];
    const quizResultLabel = (qa) => qa ? (qa.correct ? 'OK' : `BŁĄD (popr.: ${qa.correctAnswer})`) : '';
    const rows = sessionResults.map(r => [
        sessionDate,
        r.cvId,
        r.name,
        r.decision,
        quizResultLabel(r.quizDetails?.[0]),
        quizResultLabel(r.quizDetails?.[1]),
        quizResultLabel(r.quizDetails?.[2]),
        r.scores?.['Przejrzystość tekstu'] ?? '',
        r.scores?.['Transparentność wizualna'] ?? '',
        r.scores?.['Kolorystyka'] ?? '',
        r.scores?.['Kompozycja'] ?? '',
        (r.tags?.plus ?? []).join('; '),
        (r.tags?.minus ?? []).join('; '),
        (r.tags?.depends ?? []).join('; '),
        r.gazeAnalytics?.trackingEnabled ? 'TAK' : 'NIE',
        r.gazeAnalytics?.points?.length ?? 0
    ]);

    return [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\r\n');
}

app.get('/sheet-data', async (req, res) => {
    const sheetId = process.env.GOOGLE_SHEET_ID || '1FMG7MkoP8pTl_anjl8yLKLn4PPWU7ab_2qKDRBkwly0';
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Arkusz zwrócił status ${response.status}`);
        const csvText = await response.text();
        const rows = parseCsv(csvText);
        const candidates = aggregateSheetRows(rows);
        res.json({ status: 'success', candidates });
    } catch (err) {
        console.error('❌ Błąd pobierania danych z arkusza:', err.message);
        res.status(502).json({ status: 'error', message: 'Nie udało się pobrać danych z arkusza Google.' });
    }
});

let mailer = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    mailer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
} else {
    console.warn('⚠️  SMTP_USER / SMTP_PASS nie są ustawione (patrz .env.example) - wysyłka raportów mailem jest wyłączona.');
}

app.post('/report', async (req, res) => {
    const { sessionResults } = req.body;

    if (!Array.isArray(sessionResults) || sessionResults.length === 0) {
        return res.status(400).json({ status: 'error', message: 'Brak danych sesji do wysłania.' });
    }

    if (!mailer) {
        return res.status(503).json({ status: 'error', message: 'Wysyłka mailem nie jest skonfigurowana na serwerze.' });
    }

    const sessionDate = new Date().toISOString();
    const csv = buildResultsCsv(sessionResults, sessionDate);
    const toAddress = process.env.REPORT_TO_EMAIL || process.env.SMTP_USER;

    try {
        await mailer.sendMail({
            from: process.env.SMTP_USER,
            to: toAddress,
            subject: `HR Game - wyniki sesji (${sessionResults.length} CV) - ${sessionDate}`,
            text: `Zakończono sesję gry HR Game.\nLiczba ocenionych CV: ${sessionResults.length}\nSzczegóły w załączonym pliku CSV (otwiera się w Excelu).`,
            attachments: [
                {
                    filename: `hr-game-wyniki-${sessionDate.replace(/[:.]/g, '-')}.csv`,
                    content: csv
                }
            ]
        });

        console.log(`✅ Wysłano raport mailem na ${toAddress} (${sessionResults.length} CV)`);
        res.json({ status: 'success' });
    } catch (err) {
        console.error('❌ Błąd wysyłki maila:', err.message);
        res.status(500).json({ status: 'error', message: 'Nie udało się wysłać maila.' });
    }
});

const server = app.listen(PORT, () => {
    console.log(`✅ Serwer wystartował poprawnie na porcie ${PORT}`);
});

server.on('error', (err) => {
    console.error('❌ Złapano błąd serwera:', err);
});
