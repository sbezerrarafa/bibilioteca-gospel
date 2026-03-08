let todosOsLivros = [];
let filtroTexto = '';
let categoriaSelecionada = '';

async function buscarLivros() {
    const response = await fetch('livros.json');
    const livros = await response.json();

    todosOsLivros = livros;

    renderizarCategorias();
    renderizar(todosOsLivros);
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
        return;
    }

    lista.forEach(livro => {
        grid.innerHTML += `
            <div class="book-card shadow-sm">
                <img src="${livro.capa}" class="aspect-book" alt="${livro.titulo}" onerror="this.src='https://via.placeholder.com/300x400?text=Sem+Capa'">
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

    renderizar(resultado);
}

document.getElementById('inputBusca').addEventListener('input', (e) => {
    filtroTexto = e.target.value.toLowerCase();
    aplicarFiltros();
});

function limparFiltros() {
    document.getElementById('inputBusca').value = '';
    filtroTexto = '';
    categoriaSelecionada = '';

    document.querySelectorAll('.btn-category').forEach(b => {
        b.classList.remove('active');
    });

    const botaoTodos = document.querySelector('.btn-category[data-categoria=""]');
    if (botaoTodos) {
        botaoTodos.classList.add('active');
    }

    renderizar(todosOsLivros);
}

buscarLivros();