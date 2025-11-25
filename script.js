const itensSacola = [];

const blocoSacola = document.getElementById("sacola");
const listaSacola = document.getElementById("listaSacola");
const totalSacola = document.getElementById("totalSacola");
const botaoVerSacola = document.getElementById("verSacola");
const botaoFecharSacola = document.querySelector("[data-close-sacola]");
const botaoFinalizar = document.getElementById("finalizarPedido");

function formatarPreco(valor) {
  return Number(valor || 0).toFixed(2);
}

function abrirSacola() {
  document.body.classList.add("show-sacola");
}

function fecharSacola() {
  document.body.classList.remove("show-sacola");
}

function atualizarSacola() {
  if (!listaSacola || !totalSacola) {
    return;
  }

  listaSacola.innerHTML = "";
  var total = 0;

  for (var i = 0; i < itensSacola.length; i++) {
    var produto = itensSacola[i];
    total += produto.preco * produto.quantidade;

    var itemLista = document.createElement("li");
    var subtotal = formatarPreco(produto.preco * produto.quantidade);
    itemLista.textContent =
      produto.nome + " x" + produto.quantidade + " - R$ " + subtotal;
    listaSacola.appendChild(itemLista);
  }

  totalSacola.textContent = formatarPreco(total);

  if (itensSacola.length > 0) {
    abrirSacola();
  }
}

var botoesAdicionar = document.querySelectorAll(".btn-adicionar");
for (var i = 0; i < botoesAdicionar.length; i++) {
  var botao = botoesAdicionar[i];
  botao.addEventListener("click", function (evento) {
    var botaoClicado = evento.currentTarget;
    var nome = botaoClicado.dataset.nome;
    var preco = parseFloat(botaoClicado.dataset.preco);

    if (!nome || isNaN(preco)) {
      return;
    }

    var produtoExistente = null;
    for (var j = 0; j < itensSacola.length; j++) {
      if (itensSacola[j].nome === nome) {
        produtoExistente = itensSacola[j];
        break;
      }
    }

    if (produtoExistente) {
      produtoExistente.quantidade += 1;
    } else {
      itensSacola.push({ nome: nome, preco: preco, quantidade: 1 });
    }

    atualizarSacola();
  });
}

if (botaoVerSacola) {
  botaoVerSacola.addEventListener("click", function () {
    if (itensSacola.length === 0) {
      abrirSacola();
    } else {
      document.body.classList.toggle("show-sacola");
    }
  });
}

if (botaoFecharSacola) {
  botaoFecharSacola.addEventListener("click", fecharSacola);
}

document.addEventListener("click", function (evento) {
  if (!blocoSacola) {
    return;
  }

  var alvo = evento.target;
  var clicouFora =
    document.body.classList.contains("show-sacola") &&
    !blocoSacola.contains(alvo) &&
    botaoVerSacola &&
    !botaoVerSacola.contains(alvo);

  if (clicouFora) {
    fecharSacola();
  }
});

function montarMensagemPedido(numeroCliente) {
  var linhas = [];
  var total = 0;

  for (var i = 0; i < itensSacola.length; i++) {
    var produto = itensSacola[i];
    var subtotal = produto.preco * produto.quantidade;
    total += subtotal;
    linhas.push(
      "- " +
        produto.nome +
        " x" +
        produto.quantidade +
        " (R$ " +
        formatarPreco(subtotal) +
        ")"
    );
  }

  linhas.push("Total: R$ " + formatarPreco(total));
  linhas.push("Cliente: " + numeroCliente);

  return "Resumo do pedido White Label:\n" + linhas.join("\n");
}

async function enviarPedido(numeroCliente) {
  var url =
    "https://evolutionapi.solucaosistemas.cloud/message/sendText/murilo";
  var payload = {
    number: "556799641818@s.whatsapp.net",
    text: montarMensagemPedido(numeroCliente),
  };

  try {
    var resposta = await fetch(url, {
      method: "POST",
      headers: {
        apikey: "A2E2C8CED42A-4982-9821-D2677BEDAA75",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resposta.ok) {
      throw new Error("Falha no envio: " + resposta.status);
    }

    var dados = await resposta.json();
    console.log("Pedido enviado:", dados);
    alert("Pedido enviado para o vendedor!");
    fecharSacola();
  } catch (erro) {
    console.error("Erro ao enviar pedido:", erro);
    alert("Nao foi possivel enviar o pedido. Tente novamente em instantes.");
  }
}

if (botaoFinalizar) {
  botaoFinalizar.addEventListener("click", function () {
    if (itensSacola.length === 0) {
      alert("Adicione itens a sacola antes de finalizar o pedido.");
      return;
    }

    var numeroClienteEntrada = prompt(
      "Informe o numero do cliente (inclua DDD, apenas numeros):"
    );

    if (numeroClienteEntrada === null) {
      return;
    }

    var numeroCliente = numeroClienteEntrada.trim();

    if (!numeroCliente) {
      alert("Numero do cliente nao informado.");
      return;
    }

    enviarPedido(numeroCliente);
  });
}

// Controle do carrossel
const faixaSlides = document.querySelector(".slider");
const listaSlides = faixaSlides ? faixaSlides.querySelectorAll(".slide") : [];
const botaoAnterior = document.querySelector(".slider-nav.prev");
const botaoProximo = document.querySelector(".slider-nav.next");
const marcadores = document.querySelectorAll(".dot");

var slideAtual = 0;
var intervaloSlider = null;

function irParaSlide(alvo) {
  if (!faixaSlides || listaSlides.length === 0) {
    return;
  }

  slideAtual = (alvo + listaSlides.length) % listaSlides.length;
  var deslocamento = -(slideAtual * 100);
  faixaSlides.style.transform = "translateX(" + deslocamento + "%)";

  for (var i = 0; i < listaSlides.length; i++) {
    var slide = listaSlides[i];
    slide.classList.toggle("active", i === slideAtual);
  }

  for (var j = 0; j < marcadores.length; j++) {
    var marcador = marcadores[j];
    var ativo = j === slideAtual;
    marcador.classList.toggle("active", ativo);
    marcador.setAttribute("aria-selected", ativo ? "true" : "false");
  }
}

function proximoSlide() {
  irParaSlide(slideAtual + 1);
}

function slideAnterior() {
  irParaSlide(slideAtual - 1);
}

function iniciarIntervalo() {
  if (intervaloSlider) {
    clearInterval(intervaloSlider);
  }
  intervaloSlider = setInterval(proximoSlide, 6000);
}

function reiniciarIntervalo() {
  if (!faixaSlides) {
    return;
  }
  iniciarIntervalo();
}

if (botaoAnterior) {
  botaoAnterior.addEventListener("click", function () {
    slideAnterior();
    reiniciarIntervalo();
  });
}

if (botaoProximo) {
  botaoProximo.addEventListener("click", function () {
    proximoSlide();
    reiniciarIntervalo();
  });
}

for (var i = 0; i < marcadores.length; i++) {
  (function (indice) {
    marcadores[indice].addEventListener("click", function () {
      irParaSlide(indice);
      reiniciarIntervalo();
    });
  })(i);
}

if (listaSlides.length > 0) {
  iniciarIntervalo();
}

document.addEventListener("visibilitychange", function () {
  if (!faixaSlides) {
    return;
  }

  if (document.hidden) {
    clearInterval(intervaloSlider);
  } else {
    iniciarIntervalo();
  }
});
