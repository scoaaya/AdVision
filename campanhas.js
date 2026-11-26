const STORAGE_KEY = "advisionCampanhas";

const modalDetalhes = document.getElementById("detailsModal");
const modalNovaCampanha = document.getElementById("newCampaignModal");
const formularioNovaCampanha = document.getElementById("newCampaignForm");
const tabela = document.querySelector("#tabelaCampanhas tbody");
const limparFiltros = document.getElementById("limparFiltros");
const emptyState = document.getElementById("emptyState");

const campanhasBase = Array.from(
    document.querySelectorAll(".campaign-row")
).map(linha => ({
    nome: linha.dataset.nome,
    objetivo: linha.dataset.objetivo,
    investimento: Number(linha.dataset.investimento),
    leads: Number(linha.dataset.leads),
    ctr: Number(linha.dataset.ctr),
    roas: Number(linha.dataset.roas)
}));

function formatarDinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function calcularScore(cpl, ctr, roas) {
    let score = 50;

    if (ctr >= 3) score += 15;
    else if (ctr >= 2) score += 10;
    else score -= 10;

    if (cpl <= 18) score += 15;
    else if (cpl <= 22) score += 10;
    else if (cpl <= 25) score += 3;
    else score -= 10;

    if (roas >= 5) score += 20;
    else if (roas >= 4) score += 15;
    else if (roas >= 3) score += 8;
    else score -= 5;

    return Math.min(100, Math.max(0, score));
}

function definirStatus(score) {
    if (score < 70) {
        return {
            valor: "atencao",
            texto: "Atenção",
            classe: "warning-status"
        };
    }

    return {
        valor: "ativa",
        texto: "Ativa",
        classe: "active-status"
    };
}

function definirClasseScore(score) {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good-score";
    return "warning-score";
}

function definirScore(score) {
    const label = document.getElementById("scoreLabel");

    if (score >= 85) label.innerText = "Excelente performance";
    else if (score >= 70) label.innerText = "Boa performance";
    else if (score >= 50) label.innerText = "Requer atenção";
    else label.innerText = "Performance crítica";
}

function gerarDiagnostico(cpl, ctr, roas) {
    let html = "";

    if (ctr >= 2.5) {
        html += `
            <div class="diagnostic-item positive-item">
                <span>✓</span>
                <div>
                    <strong>CTR saudável</strong>
                    <p>Os anúncios estão conseguindo gerar interesse no público.</p>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="diagnostic-item warning-item">
                <span>!</span>
                <div>
                    <strong>CTR abaixo do esperado</strong>
                    <p>Considere testar novos criativos, headlines ou públicos.</p>
                </div>
            </div>
        `;
    }

    if (cpl <= 20) {
        html += `
            <div class="diagnostic-item positive-item">
                <span>✓</span>
                <div>
                    <strong>CPL saudável</strong>
                    <p>A campanha apresenta boa eficiência na geração de leads.</p>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="diagnostic-item warning-item">
                <span>!</span>
                <div>
                    <strong>CPL elevado</strong>
                    <p>Analise segmentação, criativos e conversão da página de destino.</p>
                </div>
            </div>
        `;
    }

    if (roas >= 4) {
        html += `
            <div class="diagnostic-item positive-item">
                <span>↑</span>
                <div>
                    <strong>Candidata a escala</strong>
                    <p>O retorno está saudável. Considere aumentar o orçamento gradualmente.</p>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="diagnostic-item warning-item">
                <span>!</span>
                <div>
                    <strong>Retorno limitado</strong>
                    <p>Evite escalar antes de melhorar a eficiência da campanha.</p>
                </div>
            </div>
        `;
    }

    document.getElementById("diagnosticContent").innerHTML = html;
}

function abrirCampanha(nome, investimento, leads, ctr, roas) {
    const cpl = leads > 0 ? investimento / leads : 0;
    const score = calcularScore(cpl, ctr, roas);

    document.getElementById("detailName").innerText = nome;
    document.getElementById("detailInvestment").innerText = formatarDinheiro(investimento);
    document.getElementById("detailLeads").innerText = leads;
    document.getElementById("detailCpl").innerText = formatarDinheiro(cpl);
    document.getElementById("detailCtr").innerText = ctr.toFixed(2).replace(".", ",") + "%";
    document.getElementById("detailRoas").innerText = roas.toFixed(1).replace(".", ",") + "x";
    document.getElementById("detailScore").innerText = score;

    definirScore(score);
    gerarDiagnostico(cpl, ctr, roas);

    modalDetalhes.classList.add("show");
}

function fecharDetalhes() {
    modalDetalhes.classList.remove("show");
}

function abrirNovaCampanha() {
    modalNovaCampanha.classList.add("show");
}

function fecharNovaCampanha() {
    modalNovaCampanha.classList.remove("show");
}

function criarLinha(campanha) {
    const cpl = campanha.leads > 0
        ? campanha.investimento / campanha.leads
        : 0;

    const score = calcularScore(cpl, campanha.ctr, campanha.roas);
    const status = definirStatus(score);
    const scoreClasse = definirClasseScore(score);

    const novaLinha = document.createElement("tr");
    novaLinha.classList.add("campaign-row");
    novaLinha.dataset.status = status.valor;
    novaLinha.dataset.nome = campanha.nome;
    novaLinha.dataset.objetivo = campanha.objetivo;
    novaLinha.dataset.investimento = campanha.investimento;
    novaLinha.dataset.leads = campanha.leads;
    novaLinha.dataset.ctr = campanha.ctr;
    novaLinha.dataset.roas = campanha.roas;

    novaLinha.innerHTML = `
        <td>
            <strong>${campanha.nome}</strong>
            <small>${campanha.objetivo}</small>
        </td>
        <td>
            <span class="status ${status.classe}">${status.texto}</span>
        </td>
        <td>${formatarDinheiro(campanha.investimento)}</td>
        <td>${campanha.leads}</td>
        <td>${formatarDinheiro(cpl)}</td>
        <td>${campanha.ctr.toFixed(2).replace(".", ",")}%</td>
        <td class="roas">${campanha.roas.toFixed(1).replace(".", ",")}x</td>
        <td>
            <div class="score ${scoreClasse}">${score}</div>
        </td>
    `;

    novaLinha.addEventListener("click", () => {
        abrirCampanha(
            campanha.nome,
            campanha.investimento,
            campanha.leads,
            campanha.ctr,
            campanha.roas
        );
    });

    return novaLinha;
}

function adicionarCampanhaNaTabela(campanha) {
    tabela.appendChild(criarLinha(campanha));
}

function atualizarResumo() {
    const linhas = document.querySelectorAll(".campaign-row");

    let investimentoTotal = 0;
    let leadsTotal = 0;

    linhas.forEach(linha => {
        investimentoTotal += Number(linha.dataset.investimento);
        leadsTotal += Number(linha.dataset.leads);
    });

    const cplMedio = leadsTotal > 0
        ? investimentoTotal / leadsTotal
        : 0;

    document.getElementById("totalCampanhas").innerText = linhas.length;
    document.getElementById("totalInvestimento").innerText = formatarDinheiro(investimentoTotal);
    document.getElementById("totalLeads").innerText = leadsTotal;
    document.getElementById("cplMedio").innerText = formatarDinheiro(cplMedio);
}

function atualizarEstadoVazio() {
    const linhas = [...document.querySelectorAll(".campaign-row")];
    const visiveis = linhas.filter(linha => linha.style.display !== "none");

    emptyState.style.display = visiveis.length ? "none" : "block";
}

function buscarCampanhas() {
    const busca = document
        .getElementById("buscarCampanha")
        .value
        .toLowerCase();

    const statusSelecionado = document
        .getElementById("filtroStatus")
        .value;

    document.querySelectorAll(".campaign-row").forEach(linha => {
        const nome = linha.dataset.nome.toLowerCase();
        const correspondeNome = nome.includes(busca);
        const correspondeStatus =
            statusSelecionado === "todos" ||
            statusSelecionado === linha.dataset.status;

        linha.style.display =
            correspondeNome && correspondeStatus ? "" : "none";
    });

    atualizarEstadoVazio();
}

function obterCampanhasSalvas() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function salvarCampanhas(campanhas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campanhas));
}

function carregarCampanhasSalvas() {
    obterCampanhasSalvas().forEach(adicionarCampanhaNaTabela);
    atualizarResumo();
}

modalDetalhes.addEventListener("click", event => {
    if (event.target === modalDetalhes) fecharDetalhes();
});

modalNovaCampanha.addEventListener("click", event => {
    if (event.target === modalNovaCampanha) fecharNovaCampanha();
});

formularioNovaCampanha.addEventListener("submit", event => {
    event.preventDefault();

    const campanha = {
        nome: document.getElementById("newName").value.trim(),
        objetivo: document.getElementById("newObjective").value,
        investimento: Number(document.getElementById("newInvestment").value),
        leads: Number(document.getElementById("newLeads").value),
        ctr: Number(document.getElementById("newCtr").value),
        roas: Number(document.getElementById("newRoas").value)
    };

    if (!campanha.nome) return;

    adicionarCampanhaNaTabela(campanha);

    const campanhasSalvas = obterCampanhasSalvas();
    campanhasSalvas.push(campanha);
    salvarCampanhas(campanhasSalvas);

    atualizarResumo();
    formularioNovaCampanha.reset();
    fecharNovaCampanha();
});

document.querySelectorAll(".campaign-row").forEach(linha => {
    linha.addEventListener("click", () => {
        abrirCampanha(
            linha.dataset.nome,
            Number(linha.dataset.investimento),
            Number(linha.dataset.leads),
            Number(linha.dataset.ctr),
            Number(linha.dataset.roas)
        );
    });
});

limparFiltros.addEventListener("click", () => {
    document.getElementById("buscarCampanha").value = "";
    document.getElementById("filtroStatus").value = "todos";
    buscarCampanhas();
});

carregarCampanhasSalvas();
