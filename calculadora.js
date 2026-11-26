const formularioCalculadora = document.getElementById("calculatorForm");
const resultadoCalculadora = document.getElementById("resultadoCalculadora");
const scoreCalculadora = document.getElementById("scoreCalculadora");
const erroCalculadora = document.getElementById("erroCalculadora");

const CAMPOS = ["investimento", "leads", "cliques", "impressoes", "receita"];

function lerCampo(id) {
    const texto = document.getElementById(id).value.trim();
    return texto === "" ? NaN : Number(texto);
}

function formatarDinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarNumero(valor) {
    return Number(valor).toLocaleString("pt-BR");
}

function formatarDecimal(valor) {
    return valor.toFixed(2).replace(".", ",");
}

// Mesma lógica do AdVision Score usada em campanhas.js
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

function definirClassificacao(score) {
    if (score >= 85) return "Excelente performance";
    if (score >= 70) return "Boa performance";
    if (score >= 50) return "Requer atenção";
    return "Performance crítica";
}

function definirClasseScore(score) {
    if (score >= 85) return "excellent";
    if (score >= 70) return "good-score";
    return "warning-score";
}

function validarDados(dados) {
    const algumVazio = CAMPOS.some(campo => Number.isNaN(dados[campo]));
    if (algumVazio) return "Preencha todos os campos para calcular os indicadores.";

    const algumNegativo = CAMPOS.some(campo => dados[campo] < 0);
    if (algumNegativo) return "Os valores não podem ser negativos.";

    const inteiros = ["leads", "cliques", "impressoes"];
    const algumFracionado = inteiros.some(campo => !Number.isInteger(dados[campo]));
    if (algumFracionado) return "Leads, cliques e impressões devem ser números inteiros.";

    if (dados.investimento === 0) return "O investimento deve ser maior que zero.";
    if (dados.impressoes === 0) return "As impressões devem ser maiores que zero.";
    if (dados.cliques > dados.impressoes) return "Os cliques não podem ser maiores que as impressões.";

    return "";
}

function mostrarErro(mensagem) {
    erroCalculadora.textContent = mensagem;
    erroCalculadora.style.display = "block";
    resultadoCalculadora.style.display = "none";
    scoreCalculadora.style.display = "none";
}

function limparErro() {
    erroCalculadora.textContent = "";
    erroCalculadora.style.display = "none";
}

function calcularIndicadores() {
    const dados = {};
    CAMPOS.forEach(campo => {
        dados[campo] = lerCampo(campo);
    });

    const erro = validarDados(dados);
    if (erro) {
        mostrarErro(erro);
        return;
    }

    limparErro();

    const { investimento, leads, cliques, impressoes, receita } = dados;

    // Sem leads o CPL não existe; para o Score ele conta como o pior CPL possível,
    // evitando que uma campanha sem leads ganhe pontos por "CPL baixo".
    const cpl = leads > 0 ? investimento / leads : Infinity;
    const ctr = (cliques / impressoes) * 100;
    const roas = receita / investimento;
    const score = calcularScore(cpl, ctr, roas);

    const cplTexto = leads > 0 ? formatarDinheiro(cpl) : "Sem leads";

    resultadoCalculadora.innerHTML = `
        <div><span>CPL</span><strong>${cplTexto}</strong></div>
        <div><span>CTR</span><strong>${formatarDecimal(ctr)}%</strong></div>
        <div><span>ROAS</span><strong>${formatarDecimal(roas)}x</strong></div>
        <div><span>Leads</span><strong>${formatarNumero(leads)}</strong></div>
        <div><span>Cliques</span><strong>${formatarNumero(cliques)}</strong></div>
    `;

    scoreCalculadora.innerHTML = `
        <span>AdVision Score</span>
        <strong class="calculator-score ${definirClasseScore(score)}">${score}</strong>
        <p>${definirClassificacao(score)}</p>
    `;

    resultadoCalculadora.style.display = "";
    scoreCalculadora.style.display = "";
}

formularioCalculadora.addEventListener("submit", event => {
    event.preventDefault();
    calcularIndicadores();
});
