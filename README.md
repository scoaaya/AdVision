# AdVision

Dashboard front-end para acompanhamento e análise de campanhas de tráfego pago.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-7659E8)
![HTML](https://img.shields.io/badge/HTML-5-E34F26)
![CSS](https://img.shields.io/badge/CSS-3-1572B6)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E)

## Sobre o projeto

O **AdVision** é um projeto desenvolvido para centralizar a visualização de métricas de campanhas e facilitar uma análise rápida de performance.

A aplicação permite acompanhar indicadores como:

- Investimento
- Leads
- CPL
- CTR
- ROAS
- AdVision Score

## Funcionalidades

- Dashboard com indicadores principais
- Listagem de campanhas
- Cadastro de novas campanhas
- Cálculo automático de CPL
- Cálculo automático do AdVision Score
- Diagnóstico automático baseado em CTR, CPL e ROAS
- Modal com análise detalhada da campanha
- Busca por nome
- Filtro por status
- Atualização automática dos cards de resumo
- Persistência das campanhas cadastradas com `localStorage`

## Tecnologias

- HTML5
- CSS3
- JavaScript

## Estrutura do projeto

```text
AdVision/
├── index.html
├── campanhas.html
├── campanhas.js
├── script.js
├── style.css
└── README.md
```

## Como executar

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto.
3. Execute o arquivo `index.html` ou `campanhas.html` no navegador.

Também é possível abrir o projeto pelo VS Code usando uma extensão como Live Server.

## Como usar

Na página **Campanhas**:

1. Clique em `+ Nova campanha`.
2. Informe os dados da campanha.
3. Clique em `Salvar campanha`.
4. A nova campanha será adicionada à tabela.
5. Os indicadores do topo serão recalculados automaticamente.
6. Clique em uma campanha para visualizar o diagnóstico detalhado.

As campanhas cadastradas ficam armazenadas no navegador por meio do `localStorage`, portanto permanecem disponíveis após atualizar a página no mesmo navegador.

## AdVision Score

O score é calculado automaticamente considerando três indicadores:

- **CTR:** capacidade dos anúncios de gerar interesse.
- **CPL:** eficiência do custo por lead.
- **ROAS:** retorno sobre o investimento.

A partir desses dados, a campanha recebe uma classificação visual e um diagnóstico com possíveis pontos de atenção ou oportunidades de escala.

## Próximas melhorias

- [ ] Editar campanhas
- [ ] Excluir campanhas
- [ ] Gráficos de performance
- [ ] Persistência com banco de dados
- [ ] Autenticação de usuários
- [ ] Integração com APIs de plataformas de anúncios
- [ ] Página de criativos
- [ ] Página de análises
- [ ] Calculadora de métricas

## Autora

**Katrini Santos**

Projeto desenvolvido como prática de front-end e JavaScript, combinando desenvolvimento web com análise de métricas de performance em campanhas digitais.
