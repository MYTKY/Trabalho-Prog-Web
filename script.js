const sacola = [];

const sacolaEl = document.getElementById("sacola");
const listaSacolaEl = document.getElementById("listaSacola");
const totalSacolaEl = document.getElementById("totalSacola");
const toggleSacolaBtn = document.getElementById("verSacola");
const closeSacolaBtn = document.querySelector("[data-close-sacola]");
const finalizarPedidoBtn = document.getElementById("finalizarPedido");

function formatCurrency(valor) {
  return Number(valor).toFixed(2);
}

function abrirSacola() {
  document.body.classList.add("show-sacola");
}

function fecharSacola() {
  document.body.classList.remove("show-sacola");
}

function alternarSacola() {
  document.body.classList.toggle("show-sacola");
}

function atualizarSacola() {
  if (!listaSacolaEl || !totalSacolaEl) {
    return;
  }

  listaSacolaEl.innerHTML = "";
  let total = 0;

  sacola.forEach((produto) => {
    total += produto.preco * produto.quantidade;
    const item = document.createElement("li");
    item.textContent = `${produto.nome} x${
      produto.quantidade
    } - R$ ${formatCurrency(produto.preco * produto.quantidade)}`;
    listaSacolaEl.appendChild(item);
  });

  totalSacolaEl.textContent = formatCurrency(total);

  if (sacola.length > 0) {
    abrirSacola();
  }
}

document.querySelectorAll(".btn-adicionar").forEach((botao) => {
  botao.addEventListener("click", () => {
    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);

    if (!nome || Number.isNaN(preco)) {
      return;
    }

    const existente = sacola.find((produto) => produto.nome === nome);
    if (existente) {
      existente.quantidade += 1;
    } else {
      sacola.push({ nome, preco, quantidade: 1 });
    }

    atualizarSacola();
  });
});

toggleSacolaBtn?.addEventListener("click", () => {
  if (sacola.length === 0) {
    abrirSacola();
    return;
  }
  alternarSacola();
});

closeSacolaBtn?.addEventListener("click", fecharSacola);

document.addEventListener("click", (event) => {
  if (!sacolaEl) {
    return;
  }

  const alvo = event.target;
  const clicouFora =
    document.body.classList.contains("show-sacola") &&
    !sacolaEl.contains(alvo) &&
    alvo !== toggleSacolaBtn &&
    !toggleSacolaBtn?.contains(alvo);

  if (clicouFora) {
    fecharSacola();
  }
});

function montarMensagemPedido(numeroCliente) {
  const linhas = sacola.map(
    (produto) =>
      `- ${produto.nome} x${produto.quantidade} (R$ ${formatCurrency(
        produto.preco * produto.quantidade
      )})`
  );

  const total = sacola.reduce(
    (acumulado, produto) => acumulado + produto.preco * produto.quantidade,
    0
  );

  linhas.push(`Total: R$ ${formatCurrency(total)}`);
  linhas.push(`Cliente: ${numeroCliente}`);

  return `Resumo do pedido White Label:\n${linhas.join("\n")}`;
}

async function enviarPedido(numeroCliente) {
  const url = "https://evolutionapi.solucaosistemas.cloud/message/sendText/WEB";
  const payload = {
    number: "556799641818@s.whatsapp.net",
    text: montarMensagemPedido(numeroCliente),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        apikey: "65B339CD9CFA-4E5B-BB0C-EFE4206B4256",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Falha no envio: ${response.status}`);
    }

    const data = await response.json();
    console.log("Pedido enviado:", data);
    alert("Pedido enviado para o vendedor!");
    fecharSacola();
  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    alert("Nao foi possivel enviar o pedido. Tente novamente em instantes.");
  }
}

finalizarPedidoBtn?.addEventListener("click", async () => {
  if (sacola.length === 0) {
    alert("Adicione itens a sacola antes de finalizar o pedido.");
    return;
  }

  const numeroClienteEntrada = prompt(
    "Informe o numero do cliente (inclua DDD, apenas numeros):"
  );

  if (numeroClienteEntrada === null) {
    return;
  }

  const numeroCliente = numeroClienteEntrada.trim();

  if (!numeroCliente) {
    alert("Numero do cliente nao informado.");
    return;
  }

  await enviarPedido(numeroCliente);
});

// Controle do carrossel
const slider = document.querySelector(".slider");
const slides = slider ? Array.from(slider.querySelectorAll(".slide")) : [];
const prevBtn = document.querySelector(".slider-nav.prev");
const nextBtn = document.querySelector(".slider-nav.next");
const dots = Array.from(document.querySelectorAll(".dot"));

let slideAtual = 0;
let intervaloSlider;

function irParaSlide(alvo) {
  if (!slider || slides.length === 0) {
    return;
  }

  slideAtual = (alvo + slides.length) % slides.length;
  const deslocamento = -(slideAtual * 100);
  slider.style.transform = `translateX(${deslocamento}%)`;

  slides.forEach((slide, indice) => {
    slide.classList.toggle("active", indice === slideAtual);
  });

  dots.forEach((dot, indice) => {
    const ativo = indice === slideAtual;
    dot.classList.toggle("active", ativo);
    dot.setAttribute("aria-selected", ativo ? "true" : "false");
  });
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
  if (!slider) {
    return;
  }
  iniciarIntervalo();
}

prevBtn?.addEventListener("click", () => {
  slideAnterior();
  reiniciarIntervalo();
});

nextBtn?.addEventListener("click", () => {
  proximoSlide();
  reiniciarIntervalo();
});

dots.forEach((dot, indice) => {
  dot.addEventListener("click", () => {
    irParaSlide(indice);
    reiniciarIntervalo();
  });
});

if (slides.length > 0) {
  iniciarIntervalo();
}

document.addEventListener("visibilitychange", () => {
  if (!slider) {
    return;
  }
  if (document.hidden) {
    clearInterval(intervaloSlider);
  } else {
    iniciarIntervalo();
  }
});
