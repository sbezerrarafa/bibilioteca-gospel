let todosOsLivros = [];
let filtroTexto = '';
let categoriaSelecionada = '';

let paginaAtual = 1;
const itensPorPagina = 10;
let listaFiltradaAtual = [];

async function buscarLivros() {
    const response = await fetch('livros.json');
    const livros = await response.json();

    todosOsLivros = livros;
    listaFiltradaAtual = livros;

    renderizarCategorias();
    renderizar(listaFiltradaAtual);
}

function renderizarCategorias() {
    const container = document.getElementById('filtroCategorias');

    const categoriasUnicas = [...new Set(todosOsLivros.map(livro => livro.categoria))];

    container.innerHTML = '';

    container.innerHTML += `
        <button class="btn-category active" data-categoria="">
            Todos
        </button>
    `;

    categoriasUnicas.forEach(categoria => {
        container.innerHTML += `
            <button class="btn-category" data-categoria="${categoria}">
                ${categoria}
            </button>
        `;
    });

    document.querySelectorAll('.btn-category').forEach(botao => {
        botao.addEventListener('click', function () {
            categoriaSelecionada = this.dataset.categoria;
            paginaAtual = 1;

            document.querySelectorAll('.btn-category').forEach(b => {
                b.classList.remove('active');
            });

            this.classList.add('active');
            aplicarFiltros();
        });
    });
}

function renderizar(lista) {
    const grid = document.getElementById('listaLivros');
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = `
            <div class="text-center w-100 py-5" style="grid-column: 1/-1">
                <span class="material-symbols-outlined text-muted" style="font-size: 3rem">search_off</span>
                <p class="text-muted mt-2">Nenhum livro encontrado para esta busca.</p>
                <button class="btn btn-sm btn-outline-primary" onclick="limparFiltros()">Limpar Tudo</button>
            </div>
        `;

        renderizarPaginacao(0);
        return;
    }

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const livrosDaPagina = lista.slice(inicio, fim);

    livrosDaPagina.forEach(livro => {
        grid.innerHTML += `
            <div class="book-card shadow-sm">
                <img 
                    src="${livro.capa}" 
                    class="aspect-book" 
                    alt="${livro.titulo}" 
                    onerror="this.src='https://via.placeholder.com/300x400?text=Sem+Capa'"
                >
                <div class="d-flex flex-column flex-grow-1">
                    <h3 class="book-title">${livro.titulo}</h3>
                    <p class="book-author">${livro.autor}</p>
                    <a href="${livro.arquivo}" target="_blank" class="btn-read">
                        <span class="material-symbols-outlined" style="font-size: 18px">menu_book</span>
                        LER PDF
                    </a>
                </div>
            </div>
        `;
    });

    renderizarPaginacao(lista.length);
}

function renderizarPaginacao(totalItens) {
    const container = document.getElementById('paginacao');
    container.innerHTML = '';

    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    if (totalPaginas <= 1) return;

    let html = '';

    html += `
        <button class="page-btn" ${paginaAtual === 1 ? 'disabled' : ''} onclick="irParaPagina(${paginaAtual - 1})">
            Anterior
        </button>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <button class="page-btn ${i === paginaAtual ? 'active' : ''}" onclick="irParaPagina(${i})">
                ${i}
            </button>
        `;
    }

    html += `
        <button class="page-btn" ${paginaAtual === totalPaginas ? 'disabled' : ''} onclick="irParaPagina(${paginaAtual + 1})">
            Próxima
        </button>
    `;

    container.innerHTML = html;
}

function irParaPagina(pagina) {
    paginaAtual = pagina;
    renderizar(listaFiltradaAtual);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function aplicarFiltros() {
    const resultado = todosOsLivros.filter(livro => {
        const bateTexto =
            livro.titulo.toLowerCase().includes(filtroTexto) ||
            livro.autor.toLowerCase().includes(filtroTexto);

        const bateCategoria =
            categoriaSelecionada === '' ||
            livro.categoria === categoriaSelecionada;

        return bateTexto && bateCategoria;
    });

    paginaAtual = 1;
    listaFiltradaAtual = resultado;
    renderizar(listaFiltradaAtual);
}

document.getElementById('inputBusca').addEventListener('input', (e) => {
    filtroTexto = e.target.value.toLowerCase();
    paginaAtual = 1;
    aplicarFiltros();
});

function limparFiltros() {
    document.getElementById('inputBusca').value = '';
    filtroTexto = '';
    categoriaSelecionada = '';
    paginaAtual = 1;

    document.querySelectorAll('.btn-category').forEach(b => {
        b.classList.remove('active');
    });

    const botaoTodos = document.querySelector('.btn-category[data-categoria=""]');
    if (botaoTodos) {
        botaoTodos.classList.add('active');
    }

    listaFiltradaAtual = todosOsLivros;
    renderizar(listaFiltradaAtual);
}

buscarLivros();