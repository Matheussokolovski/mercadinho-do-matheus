document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('catalogo.html')) {
    verificarLogin();
    carregarCatalogo();
    exibirCarrinho();
  }
});

function verificarLogin() {
  if (localStorage.getItem('loggedIn') !== 'true') {
    window.location.href = 'index.html';
  }
}

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function carregarCatalogo() {
  fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(produtos => {
      const catalogo = document.getElementById('catalogo');
      produtos.forEach(produto => {
        const item = document.createElement('div');
        item.innerHTML = `
          <img src="${produto.image}" width="100"><br>
          <strong>${produto.title}</strong><br>
          <p>${produto.description.substring(0, 100)}...</p>
          <strong>R$ ${produto.price.toFixed(2)}</strong><br>
        `;
        const botao = document.createElement('button');
        botao.textContent = 'Adicionar ao Carrinho';
        botao.addEventListener('click', () => {
          adicionarAoCarrinho(produto.id, produto.title, produto.price);
        });
        item.appendChild(botao);
        catalogo.appendChild(item);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar o catálogo:', error);
    });
}

function adicionarAoCarrinho(id, titulo, preco) {
  carrinho.push({ id, titulo, preco });
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirCarrinho();
}

function exibirCarrinho() {
  const carrinhoDiv = document.getElementById('carrinho');
  carrinhoDiv.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco;
    const divItem = document.createElement('div');
    divItem.innerHTML = `
      ${item.titulo} - R$ ${item.preco.toFixed(2)}
      <button onclick="removerDoCarrinho(${index})">Remover</button>
    `;
    carrinhoDiv.appendChild(divItem);
  });

  const totalDiv = document.getElementById('total');
  if (totalDiv) {
    totalDiv.innerText = `Total: R$ ${total.toFixed(2)}`;
  }
}

function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  exibirCarrinho();
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  window.location.href = 'checkout.html';
}
