// Współdzielone funkcje renderujące raport analityczny (summary.html i analysis.html)

const ALL_CV_TAGS = ["Zdjęcie", "Czcionka", "Klauzula poufności", "Ikony / emoji / grafiki", "Adres zamieszkania", "Odnośniki zewnętrzne", "Długość CV", "Układ / kolumny"];

const ICON_PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>';
const ICON_MINUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" transform="rotate(180 12 12)"/></svg>';
const ICON_ARROW_UP_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
const ICON_ARROW_DOWN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
const ICON_DASH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const ICON_EYE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';

// Mały wykres kołowy (donut) z wartością 0-10 na środku.
function renderDonut(label, value, opts = {}) {
    const numValue = Number(value);
    const hasValue = value !== null && value !== undefined && !Number.isNaN(numValue);
    const pct = hasValue ? Math.max(0, Math.min(100, (numValue / 10) * 100)) : 0;
    const color = !hasValue ? '#E0E0E0' : numValue >= 7 ? '#0E8A5F' : numValue >= 4 ? '#0066FF' : '#D93025';
    const size = opts.size || 56;
    const stroke = opts.strokeWidth || 4;
    const fontSize = opts.fontSize || 9;
    const displayValue = hasValue ? (Number.isInteger(numValue) ? numValue : numValue.toFixed(1)) : '-';
    const itemClass = 'donut-item' + (opts.ovr ? ' donut-ovr' : '') + (opts.best ? ' is-best-donut' : '');
    return `
        <div class="${itemClass}">
            <svg viewBox="0 0 42 42" width="${size}" height="${size}" class="donut-chart">
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#E0E0E0" stroke-width="${stroke}"></circle>
                <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="${color}" stroke-width="${stroke}"
                    stroke-dasharray="${pct} ${100 - pct}" stroke-dashoffset="25"></circle>
                <text x="21" y="24" text-anchor="middle" font-size="${fontSize}" font-weight="700" fill="#1A1A1A">${displayValue}</text>
            </svg>
            <div class="donut-label">${label}</div>
        </div>
    `;
}

// Blok statystyk społeczności (liczba opinii, % zatrudnień, śr. OVR) + opcjonalne porównanie z wynikiem bieżącej sesji.
function renderCommunityBlock(sheetData, userOvr) {
    const opinions = sheetData?.opinions ?? 0;
    const hirePct = sheetData && opinions ? Math.round((sheetData.hireCount / opinions) * 100) : null;
    const avgOvr = sheetData?.avgOvr ?? null;

    let compareHtml = '';
    if (userOvr !== undefined && userOvr !== null) {
        const delta = avgOvr !== null ? +(userOvr - avgOvr).toFixed(1) : null;
        let deltaBadgeHtml = `<span class="delta-badge neutral">${ICON_DASH_SVG} ${t('rep.noData')}</span>`;
        if (delta !== null) {
            if (delta > 0) deltaBadgeHtml = `<span class="delta-badge positive">${ICON_ARROW_UP_SVG}+${delta} ${t('rep.vsAverage')}</span>`;
            else if (delta < 0) deltaBadgeHtml = `<span class="delta-badge negative">${ICON_ARROW_DOWN_SVG}${delta} ${t('rep.vsAverage')}</span>`;
            else deltaBadgeHtml = `<span class="delta-badge neutral">${ICON_DASH_SVG} ${t('rep.sameAsAverage')}</span>`;
        }
        compareHtml = `
            <div class="community-compare">
                <span>${t('rep.yourOvr')} <strong>${userOvr.toFixed(1)}</strong></span>
                ${deltaBadgeHtml}
            </div>
        `;
    }

    const opinionsLabel = opinionCountLabel(opinions);
    const opinionsCountText = opinionsLabel.slice(0, opinionsLabel.indexOf(' '));
    const opinionsWordText = opinionsLabel.slice(opinionsLabel.indexOf(' ') + 1);

    return `
        <div class="community-block">
            <div class="community-stats">
                <div class="community-stat">
                    <div class="community-stat-value">${opinionsCountText}</div>
                    <div class="community-stat-label">${opinionsWordText}</div>
                </div>
                <div class="community-stat">
                    <div class="community-stat-value">${hirePct !== null ? hirePct + '%' : '-'}</div>
                    <div class="community-stat-label">${t('rep.hires')}</div>
                </div>
                <div class="community-stat">
                    <div class="community-stat-value">${avgOvr ?? '-'}</div>
                    <div class="community-stat-label">${t('rep.avgOvrOthers')}</div>
                </div>
            </div>
            ${compareHtml}
        </div>
    `;
}

// Paski "jak oceniane są elementy tego CV" - zawsze wszystkie tematy z ALL_CV_TAGS;
// opcjonalnie podświetla ikoną wybór użytkownika z bieżącej sesji (userTags = {plus:[], minus:[], depends:[]}).
function renderTagBars(sheetData, userTags) {
    let html = `
        <div class="tagbar-title">
            <span>${t('rep.tagBarsTitle')}</span>
            <span class="tagbar-legend">
                <span class="tagbar-legend-item"><span class="tagbar-legend-dot"></span>${t('rep.avgAllLegend')}</span>
                ${userTags ? `<span class="tagbar-legend-item"><span class="tagbar-legend-icon">${ICON_PLUS_SVG}</span>${t('rep.yourPickLegend')}</span>` : ''}
            </span>
        </div>
    `;

    ALL_CV_TAGS.forEach(tag => {
        const tagStats = sheetData?.tags?.[tag];
        const plus = tagStats?.plus ?? 0;
        const minus = tagStats?.minus ?? 0;
        const total = plus + minus;
        const avgPct = total > 0 ? Math.round((plus / total) * 100) : 50;
        const avgLabelAlign = avgPct <= 8 ? 'left:0; transform:translateX(0);' : avgPct >= 92 ? 'left:100%; transform:translateX(-100%);' : `left:${avgPct}%; transform:translateX(-50%);`;

        let userChoice = null;
        if (userTags) {
            if (userTags.plus?.includes(tag)) userChoice = 'plus';
            else if (userTags.minus?.includes(tag)) userChoice = 'minus';
            else if (userTags.depends?.includes(tag)) userChoice = 'depends';
        }

        const countLabel = total > 0
            ? `<span class="tagbar-pct">${opinionCountLabel(total)} · ${t('rep.positivePctSuffix', {pct: avgPct})}</span>`
            : `<span class="tagbar-pct is-empty">${t('rep.noOpinionsYet')}</span>`;
        const userNoteHtml = userChoice === 'depends' ? `<span class="tagbar-user-note">${t('rep.yourPickDepends')}</span>` : '';
        const avgValueHtml = total > 0 ? `<span class="tagbar-marker-value" style="${avgLabelAlign}">${avgPct}%</span>` : '';

        html += `
            <div class="tagbar-row">
                <span class="tagbar-icon-btn icon-minus${userChoice === 'minus' ? ' is-user-pick' : ''}">${ICON_MINUS_SVG}</span>
                <div class="tagbar-main">
                    <div class="tagbar-label">
                        <span class="tagbar-label-name"><span>${tagLabel(tag)}</span>${userNoteHtml}</span>
                        ${countLabel}
                    </div>
                    <div class="tagbar-track-wrap">
                        <div class="tagbar-track">
                            <div class="tagbar-marker" style="left:${avgPct}%">${avgValueHtml}</div>
                        </div>
                    </div>
                </div>
                <span class="tagbar-icon-btn icon-plus${userChoice === 'plus' ? ' is-user-pick' : ''}">${ICON_PLUS_SVG}</span>
            </div>
        `;
    });

    return html;
}

// Buduje pełną kartę analizy jednego CV (donut OVR, donuty per kryterium, blok społeczności, paski tagów).
// sheetData: zagregowane dane z arkusza dla tego CV (może być undefined, gdy brak jeszcze żadnych opinii).
// opts: { name, decision, scores, tags, ovr, isBest, bestLabel, showSessionCompare, imageSrc }
//   - showSessionCompare=true używa opts.scores/opts.ovr/opts.tags/opts.decision (kontekst właśnie zagranej sesji)
//   - showSessionCompare=false (domyślnie) pokazuje czyste dane historyczne z arkusza, bez "Twój wybór"/"Twój OVR"
function renderCvAnalysisCard(sheetData, opts = {}) {
    const showSession = !!opts.showSessionCompare;
    const name = opts.name ?? sheetData?.name ?? t('rep.unknownCv');
    const scores = showSession ? (opts.scores || {}) : (sheetData?.avgScores || {});
    const ovrValue = showSession ? opts.ovr : (sheetData?.avgOvr ?? null);

    const ovrDonutHtml = renderDonut('OVR', ovrValue, { size: 76, strokeWidth: 6, fontSize: 14, ovr: true, best: !!opts.isBest });

    let donutsHtml = '';
    Object.entries(scores).forEach(([crit, val]) => {
        donutsHtml += renderDonut(criteriaLabel(crit), val);
    });

    const communityHtml = renderCommunityBlock(sheetData, showSession ? opts.ovr : null);
    const tagBarsHtml = renderTagBars(sheetData, showSession ? opts.tags : null);

    const previewHtml = opts.imageSrc ? `
        <div class="cv-preview-btn" tabindex="0">${ICON_EYE_SVG}</div>
        <div class="cv-preview-popup"><img src="${opts.imageSrc}" alt="${t('rep.previewAlt')}"></div>
    ` : '';

    return `
        <div class="aggregate-card ${opts.isBest ? 'is-best' : ''}">
            ${previewHtml}
            <div class="aggregate-card-header">
                ${ovrDonutHtml}
                <div class="aggregate-card-title">
                    ${opts.isBest ? `<div class="best-tag">${opts.bestLabel || t('rep.bestResultDefault')}</div>` : ''}
                    <div class="aggregate-card-name">${name}</div>
                    ${opts.decision ? `<div class="aggregate-card-decision">${decisionLabel(opts.decision)}</div>` : ''}
                </div>
            </div>
            <div class="donut-row">${donutsHtml}</div>
            ${communityHtml}
            ${tagBarsHtml}
        </div>
    `;
}
