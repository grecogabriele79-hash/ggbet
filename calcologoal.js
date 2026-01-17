document.getElementById("calcoloGoal").addEventListener("submit", function (e) {
    e.preventDefault();

    const pc = +partiteGiocatecasa.value;
    const gc = +goalSegnaticasa.value;
    const sc = +goalSubiticasa.value;

    const pt = +partiteGiocatetras.value;
    const gt = +goalSegnatitras.value;
    const st = +goalSubititras.value;

    const mediaFattiCasa = gc / pc;
    const mediaSubitiCasa = sc / pc;
    const mediaFattiTras = gt / pt;
    const mediaSubitiTras = st / pt;

    const xG_casa = (mediaFattiCasa + mediaSubitiTras) / 2;
    const xG_tras = (mediaFattiTras + mediaSubitiCasa) / 2;

    function fattoriale(n) {
        return n <= 1 ? 1 : n * fattoriale(n - 1);
    }

    function poisson(k, lambda) {
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / fattoriale(k);
    }

    let probCasa = [];
    let probTras = [];

    for (let i = 0; i <= 5; i++) {
        probCasa[i] = poisson(i, xG_casa);
        probTras[i] = poisson(i, xG_tras);
    }

    let risultati = [];

    for (let c = 0; c <= 5; c++) {
        for (let t = 0; t <= 5; t++) {
            risultati.push({
                score: `${c}-${t}`,
                prob: probCasa[c] * probTras[t]
            });
        }
    }

    risultati.sort((a, b) => b.prob - a.prob);
    risultati = risultati.slice(0, 5);

    let output = `
        <h3>Goal attesi</h3>
        <p>Squadra Casa: ${xG_casa.toFixed(2)}</p>
        <p>Squadra Trasferta: ${xG_tras.toFixed(2)}</p>

        <h3>Probabilità goal Squadra Casa</h3>
        ${probCasa.map((p, i) => `${i} goal: ${(p * 100).toFixed(1)}%`).join("<br>")}

        <h3>Probabilità goal Squadra Trasferta</h3>
        ${probTras.map((p, i) => `${i} goal: ${(p * 100).toFixed(1)}%`).join("<br>")}

        <h3>Top 5 risultati esatti</h3>
        ${risultati.map(r => `${r.score} → ${(r.prob * 100).toFixed(2)}%`).join("<br>")}
    `;

    document.getElementById("risultato").innerHTML = output;
});
