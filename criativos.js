
// ==========================================
// 1. CONFIGURAÇÕES
// ==========================================

const CREATIVE_KEY = "advisionCriativos";

const form = document.getElementById("creativeForm");
const list = document.getElementById("creativeList");


// ==========================================
// 2. MANIPULAÇÃO DO LOCALSTORAGE
// ==========================================

function obterCriativos() {

    try {

        return JSON.parse(
            localStorage.getItem(CREATIVE_KEY) || "[]"
        );

    } catch (erro) {

        console.error("Erro ao recuperar criativos:", erro);

        return [];

    }

}


function salvarCriativos(dados) {

    try {

        localStorage.setItem(
            CREATIVE_KEY,
            JSON.stringify(dados)
        );

    } catch (erro) {

        console.error("Erro ao salvar criativos:", erro);

        alert("Não foi possível salvar o criativo.");

        return false;

    }

    return true;

}


// ==========================================
// 3. SEGURANÇA DOS DADOS
// ==========================================

function escaparHTML(valor) {

    return String(valor).replace(/[&<>"']/g, caractere => {

        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entidades[caractere];

    });

}


// ==========================================
// 4. DEFINIÇÃO VISUAL DOS STATUS
// ==========================================

function definirStatus(status) {

    if (status === "Ativo") {

        return "active-status";

    }

    if (status === "Em teste") {

        return "warning-status";

    }

    return "creative-inactive-status";

}


// ==========================================
// 5. RENDERIZAÇÃO DOS CRIATIVOS
// ==========================================

function renderizarCriativos() {

    const criativos = obterCriativos();

    // Verifica se existem criativos cadastrados

    if (!criativos.length) {

        list.innerHTML = `
            <div class="empty-state">
                <strong>Nenhum criativo cadastrado</strong>

                <p>
                    Cadastre o primeiro criativo para começar
                    o controle.
                </p>
            </div>
        `;

        return;

    }

    // Cria os cards de cada criativo

    list.innerHTML = criativos.map(item => {

        const nome = escaparHTML(item.nome);
        const formato = escaparHTML(item.formato);
        const campanha = escaparHTML(item.campanha);
        const status = escaparHTML(item.status);

        const classeStatus = definirStatus(item.status);

        return `

            <article class="creative-card">

                <div class="creative-card-header">

                    <span class="eyebrow">
                        ${formato}
                    </span>

                    <span class="status ${classeStatus}">
                        ${status}
                    </span>

                </div>

                <h3>${nome}</h3>

                <p>
                    Campanha: ${campanha}
                </p>

            </article>

        `;

    }).join("");

}


// ==========================================
// 6. CADASTRO DE NOVOS CRIATIVOS
// ==========================================

form.addEventListener("submit", event => {

    event.preventDefault();

    // Captura os dados do formulário

    const novo = {

        id: Date.now(),

        nome: document
            .getElementById("creativeName")
            .value.trim(),

        formato: document
            .getElementById("creativeFormat")
            .value,

        campanha: document
            .getElementById("creativeCampaign")
            .value.trim(),

        status: document
            .getElementById("creativeStatus")
            .value

    };


    // Validação dos campos

    if (!novo.nome || !novo.campanha) {

        alert("Preencha todos os campos obrigatórios.");

        return;

    }


    // Recupera os criativos existentes

    const dados = obterCriativos();


    // Adiciona o novo criativo

    dados.push(novo);


    // Salva os dados

    const salvou = salvarCriativos(dados);

    if (!salvou) return;


    // Limpa o formulário

    form.reset();


    // Atualiza os cards

    renderizarCriativos();

});


// ==========================================
// 7. INICIALIZAÇÃO
// ==========================================

renderizarCriativos();
