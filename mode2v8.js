let history = JSON.parse(localStorage.getItem('dbdMatches2v8')) || [];

function saveMatch() {
    const killer1 = document.getElementById('killer1-select').value;
    const killer2 = document.getElementById('killer2-select').value;
    const camp = document.getElementById('check-camp').checked;
    const tunnel = document.getElementById('check-tunnel').checked;
    const slug = document.getElementById('check-slug').checked;
    const bot = document.getElementById('check-bot').checked;
    const meanally = document.getElementById('check-meanally').checked;
    const surviverhacker = document.getElementById('check-surviverhacker').checked;
    const killerhacker = document.getElementById('check-killerhacker').checked;
    const escaped = document.getElementById('check-escaped').checked;
    const hatch = document.getElementById('check-hatch').checked;
    const nicegame = document.getElementById('check-nicegame').checked;
    history.push({ killer1, killer2, camp, tunnel, slug, escaped, hatch, bot, meanally, nicegame, surviverhacker, killerhacker });
    localStorage.setItem('dbdMatches2v8', JSON.stringify(history));

    showSuccessToast("Partie enregistrée !");
    updateDisplay2v8();
}

function updateDisplay2v8(matchHistory) {
    history = matchHistory || JSON.parse(localStorage.getItem('dbdMatches2v8')) || [];
    const display = document.getElementById('display-stats');
    if (history.length === 0) {
        display.innerHTML = "Aucune donnée disponible.";
        return;
    }

    let totalCamp = history.filter(m => m.camp).length;
    let totalTunnel = history.filter(m => m.tunnel).length;
    let totalSlug = history.filter(m => m.slug).length;
    let totalEscaped = history.filter(m => m.escaped).length;
    let totalHatch = history.filter(m => m.hatch).length;
    let totalBot = history.filter(m => m.bot).length;
    let totalMeanally = history.filter(m => m.meanally).length;
    let totalNicegame = history.filter(m => m.nicegame).length;
    let totalSurviverHacker = history.filter(m => m.surviverhacker).length;
    let totalKillerHacker = history.filter(m => m.killerhacker).length;
    let statsPerKillerCombo = {};

    // loop on each match to calculate stats per killer
    history.forEach(match => {
        // set killer 1 and 2 in alphabetical order to avoid having duplicate stats for the same combo
        const sortedkillerNames = [match.killer1, match.killer2].sort();
        const comboKey = sortedkillerNames.join(" & "); // ex: "Trapper & Wraith"
        //If the killer combo is not yet in the stats, initialize it
        if (!statsPerKillerCombo[comboKey]) {
            statsPerKillerCombo[comboKey] = { match: 0, camp: 0, tunnel: 0, slug: 0, escaped: 0, hatch: 0, bot: 0, meanally: 0, nicegame: 0, killerhacker: 0, surviverhacker: 0 };
        }

        // Increment all counter for this killer
        statsPerKillerCombo[comboKey].match++;
        if (match.camp) statsPerKillerCombo[comboKey].camp++;
        if (match.tunnel) statsPerKillerCombo[comboKey].tunnel++;
        if (match.slug) statsPerKillerCombo[comboKey].slug++;
        if (match.escaped) statsPerKillerCombo[comboKey].escaped++;
        if (match.hatch) {
            statsPerKillerCombo[comboKey].hatch++;
            statsPerKillerCombo[comboKey].escaped++
        }
        if (match.bot) statsPerKillerCombo[comboKey].bot++;
        if (match.meanally) statsPerKillerCombo[comboKey].meanally++;
        if (match.nicegame) statsPerKillerCombo[comboKey].nicegame++;
        if (match.killerhacker) statsPerKillerCombo[comboKey].killerhacker++;
        if (match.surviverhacker) statsPerKillerCombo[comboKey].surviverhacker++;
    });


    let completeStatsContent = `
                                        <div class="stat-item"><span>Matchs totaux :</span> <b>${history.length}</b></div>
                                        <div class="stat-item"><span>Taux de Camp :</span> <b>${((totalCamp / history.length) * 100).toFixed(1)}%</b></div>
                                        <div class="stat-item"><span>Taux de Tunnel :</span> <b>${((totalTunnel / history.length) * 100).toFixed(1)}%</b></div>
                                        <div class="stat-item"><span>Taux de Slug :</span> <b>${((totalSlug / history.length) * 100).toFixed(1)}%</b></div>                                                                                
                                        <div class="stat-item"><span>Taux de Bot :</span> <b>${((totalBot / history.length) * 100).toFixed(1)}%</b></div>
                                        <div class="stat-item"><span>Taux de Méchant survivant :</span> <b>${((totalMeanally / history.length) * 100).toFixed(1)}%</b></div>                                        
                                        <div class="stat-item"><span>Taux de Survivant hacker :</span> <b>${((totalSurviverHacker / history.length) * 100).toFixed(1)}%</b></div>
                                        <div class="stat-item"><span>Taux de Killer hacker :</span> <b>${((totalKillerHacker / history.length) * 100).toFixed(1)}%</b></div>
                                        <div class="stat-item"><span>Taux de Victoire :</span> <b>${((totalEscaped / history.length) * 100).toFixed(1)}%</b></div>
                                        <div class="stat-item"><span>Taux de Sortie par trappe :</span> <b>${((totalHatch / history.length) * 100).toFixed(1)}%</b></div>
                                        <div class="stat-item"><span>Taux de Partie plaisante :</span> <b>${((totalNicegame / history.length) * 100).toFixed(1)}%</b></div>

                                        <h4>Stats par Tueur :</h4>
                                        <div class="table-responsive">
                                            <table class="stats-table">
                                                <thead>
                                                    <tr>
                                                        <th>Tueur</th>                                                    
                                                        <th class="stat-value">Camp</th>
                                                        <th class="stat-value">Tunnel</th>
                                                        <th class="stat-value">Slug</th>                                                                                                        
                                                        <th class="stat-value">Bot</th>
                                                        <th class="stat-value">Méchant survivant</th>
                                                        <th class="stat-value">Survivant hacker</th>
                                                        <th class="stat-value">Killer hacker</th>
                                                        <th class="stat-value">Victoire</th>
                                                        <th class="stat-value">Trappe</th>
                                                        <th class="stat-value">Partie plaisante</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                    `;

    // sort killers by number of match
    const sortedKillerComboMatches = Object.entries(statsPerKillerCombo).sort((a, b) => b[1].match - a[1].match);

    sortedKillerComboMatches.forEach(([comboKey, data]) => {
        const [killer1, killer2] = comboKey.split(" & ");
        let percentCamp = ((data.camp / data.match) * 100).toFixed(0);
        let percentTunnel = ((data.tunnel / data.match) * 100).toFixed(0);
        let percentSlug = ((data.slug / data.match) * 100).toFixed(0);
        let percentBot = ((data.bot / data.match) * 100).toFixed(0);
        let percentMeanAlly = ((data.meanally / data.match) * 100).toFixed(0);
        let percentSurviverHacker = ((data.surviverhacker / data.match) * 100).toFixed(0);
        let percentKillerHacker = ((data.killerhacker / data.match) * 100).toFixed(0);
        let percentEscaped = ((data.escaped / data.match) * 100).toFixed(0);
        let percentHatch = ((data.hatch / data.match) * 100).toFixed(0);
        let percentNicegame = ((data.nicegame / data.match) * 100).toFixed(0);
        completeStatsContent += `
                                            <tr>
                                                <td class="killer-combo-name">
                                                    <div class="killer-name-noborder">${killer1} (${data.match})</div>
                                                    <div class="killer-name-noborder">${killer2}</div>
                                                </td>
                                                <td class="stat-value">${percentCamp}%</td>
                                                <td class="stat-value">${percentTunnel}%</td>
                                                <td class="stat-value">${percentSlug}%</td>
                                                <td class="stat-value">${percentBot}%</td>
                                                <td class="stat-value">${percentMeanAlly}%</td>
                                                <td class="stat-value">${percentSurviverHacker}%</td>
                                                <td class="stat-value">${percentKillerHacker}%</td>
                                                <td class="stat-value">${percentEscaped}%</td>
                                                <td class="stat-value">${percentHatch}%</td>
                                                <td class="stat-value">${percentNicegame}%</td>                                                                                                        
                                            </tr>
                                    `;

    });

    completeStatsContent += `</tbody></table></div>`;

    display.innerHTML = completeStatsContent;
}

updateDisplay2v8();