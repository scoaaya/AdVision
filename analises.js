
// Campanhas iniciais do sistema
const base = [
    {
        nome: "Remarketing | 30D",
        investimento: 1940,
        leads: 118,
        ctr: 3.47,
        roas: 5.8
    },
    {
        nome: "Captação | Julho",
        investimento: 2850,
        leads: 142,
        ctr: 2.91,
        roas: 4.2
    },
    {
        nome: "Lookalike | Leads",
        investimento: 2130,
        leads: 87,
        ctr: 1.89,
        roas: 2.7
    }
];

// Recupera as campanhas salvas no LocalStorage
const salvas = JSON.parse(
    localStorage.getItem("advisionCampanhas") || "[]"
);

// Junta as campanhas iniciais com as cadastradas
const campanhas = [...base, ...salvas].map(c => ({
    ...c,
    investimento: Number(c.investimento) || 0,
    leads: Number(c.leads) || 0,
    ctr: Number(c.ctr) || 0,
    roas: Number(c.roas) || 0
}));

// Calcula o AdVision Score
function score(c) {

    const cpl = c.leads ? c.investimento / c.leads : 0;

    let s = 50;

    // Pontuação do CTR
    if (c.ctr >= 3) {
        s += 15;
    } else if (c.ctr >= 2) {
        s += 10;
    } else {
        s -= 10;
    }

    // Pontuação do CPL
    if (cpl <= 18) {
        s += 15;
    } else if (cpl <= 22) {
        s += 10;
    } else if (cpl <= 25) {
        s += 3;
    } else {
        s -= 10;
    }

    // Pontuação do ROAS
    if (c.roas >= 5) {
        s += 20;
    } else if (c.roas >= 4) {
        s += 15;
    } else if (c.roas >= 3) {
        s += 8;
    } else {
        s -= 5;
    }

    return Math.max(0, Math.min(100, s));
}

// Formata os valores em reais
function moeda(v) {
    return v.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Protege os textos inseridos no HTML
function textoSeguro(valor) {
    const elemento = document.createElement("span");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

// Classifica as campanhas
function classificacao(s) {

    if (s >= 85) {
        return "Excelente";
    }

    if (s >= 70) {
        return "Boa";
    }

    return "Atenção";
}

// Calcula o investimento total
const investimento = campanhas.reduce(
    (total, c) => total + c.investimento, 0
);

// Calcula o total de leads
const leads = campanhas.reduce(
    (total, c) => total + c.leads, 0
);

// Calcula o CPL médio
const cpl = leads ? investimento / leads : 0;

// Exibe os cards de resumo
document.getElementById("analysisSummary").innerHTML = `

    <article class="summary-card">
        <span>Campanhas</span>
        <strong>${campanhas.length}</strong>
    </article>

    <article class="summary-card">
        <span>Investimento</span>
        <strong>${moeda(investimento)}</strong>
    </article>

    <article class="summary-card">
        <span>Leads</span>
        <strong>${leads}</strong>
    </article>

    <article class="summary-card">
        <span>CPL médio</span>
        <strong>${moeda(cpl)}</strong>
    </article>

`;

// Exibe o diagnóstico das campanhas
document.getElementById("analysisList").innerHTML =

    campanhas.map(c => {

        const s = score(c);

        const cplCampanha = c.leads
            ? c.investimento / c.leads
            : 0;

        // Recomendação padrão
        let recomendacao =
            "Mantenha o acompanhamento e continue testando variações.";

        // Define a recomendação conforme o Score
        if (s < 70) {

            recomendacao =
                "Priorize a revisão de criativos, CTR e eficiência do investimento.";

        } else if (s >= 85) {

            recomendacao =
                "Campanha com bom desempenho. Avalie escala gradual.";

        }

        // Cria o card de cada campanha
        return `

            <article class="analysis-card">

                <div>

                    <span class="eyebrow">
                        ${classificacao(s)}
                    </span>

                    <h3>${textoSeguro(c.nome)}</h3>

                    <p>
                        CPL ${moeda(cplCampanha)} ·
                        CTR ${c.ctr.toFixed(2).replace(".", ",")}% ·
                        ROAS ${c.roas.toFixed(1).replace(".", ",")}x
                    </p>

                </div>

                <div class="analysis-score">
                    ${s}
                </div>

                <div class="recommendation">
                    ${recomendacao}
                </div>

            </article>

        `;

    }).join("");