let cart = [];
let total = 0;
let points = 0;

/* LOJA */
function selecionarLoja(loja){
  localStorage.setItem("loja", loja);

  document.getElementById("storeName").innerText = loja;

  document.getElementById("storePage").style.display = "none";
  document.getElementById("appPage").style.display = "block";
}

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  const lgpd = document.getElementById("lgpd").checked;
  const msg = document.getElementById("msg");

  if (user === "" || pass === "") {
    msg.innerHTML = "Preencha usuário e senha.";
    return;
  }

  if (!lgpd) {
    msg.innerHTML = "Você precisa aceitar a LGPD.";
    return;
  }

  if (user !== "admin" || pass !== "1234") {
    msg.innerHTML = "Usuário ou senha incorretos.";
    return;
  }

  msg.innerHTML = "";

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("storePage").style.display = "flex";
}

/* CADASTRO */
function register() {
  alert("Tela de cadastro em desenvolvimento.");
}

/* TROCAR TELAS */
function showScreen(screenId){

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("show");
    screen.style.display = "none";
  });

  const target = document.getElementById(screenId);

  target.style.display = "block";
  target.classList.add("show");
}

/* CARRINHO */
function addItem(name, price){
  cart.push({ name, price });
  total += price;

  updateCart();
  showToast(`${name} adicionado ao carrinho`);
}

function updateCart(){

  const cartList = document.getElementById("cartList");
  const totalElement = document.getElementById("total");

  cartList.innerHTML = "";

  if(cart.length === 0){
    cartList.innerHTML = `<p class="empty">Seu carrinho está vazio</p>`;
  } else {
    cart.forEach(item=>{
      cartList.innerHTML += `
        <div class="cart-item">
          <span>${item.name}</span>
          <strong>R$ ${item.price.toFixed(2)}</strong>
        </div>
      `;
    });
  }

  let payment = document.querySelector('input[name="payment"]:checked')?.value || "credito";

  let finalTotal = total;

  if(payment === "pix"){
    finalTotal = total - (total * 0.05);
  }

  totalElement.innerHTML = finalTotal.toFixed(2);
}

/* PAGAMENTO */
function changePayment(){

  const payment = document.querySelector('input[name="payment"]:checked').value;
  const pixArea = document.getElementById("pixArea");

  if(payment === "pix"){
    pixArea.style.display = "block";
    showToast("PIX selecionado • 5% OFF aplicado");
  } else {
    pixArea.style.display = "none";
  }

  updateCart();
}

/* CHECKOUT */
function checkout(){

  if(cart.length === 0){
    alert("Seu carrinho está vazio.");
    return;
  }

  const payment = document.querySelector('input[name="payment"]:checked').value;

  let finalTotal = total;

  if(payment === "pix"){
    finalTotal = total - (total * 0.05);
  }

  const confirmOrder = confirm(
    `Confirmar pedido?\n\nForma de pagamento: ${payment.toUpperCase()}\nTotal: R$ ${finalTotal.toFixed(2)}`
  );

  if(!confirmOrder) return;

  const earnedPoints = Math.floor(finalTotal / 10);
  points += earnedPoints;

  document.getElementById("points").innerHTML = points;

  showToast(`Pedido confirmado! Você ganhou ${earnedPoints} pontos ⭐`);

  cart = [];
  total = 0;

  updateCart();

  goToStatusScreen();
  startOrderStatus();
}

/* STATUS */
function goToStatusScreen(){

  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("show");
    s.style.display = "none";
  });

  const status = document.getElementById("statusPage");

  status.style.display = "block";
  status.classList.add("show");
}

/* ANIMAÇÃO STATUS */
function startOrderStatus(){

  resetSteps();

  const steps = {
    step1: document.getElementById("step1"),
    step2: document.getElementById("step2"),
    step3: document.getElementById("step3"),
    lines: document.querySelectorAll("#statusPage .line")
  };

  if(!steps.step1 || !steps.step2 || !steps.step3) return;

  steps.step1.classList.add("active");

  setTimeout(()=>{
    steps.step2.classList.add("active");
    if(steps.lines[0]) steps.lines[0].classList.add("active");
  }, 3000);

  setTimeout(()=>{
    steps.step3.classList.add("active");
    if(steps.lines[1]) steps.lines[1].classList.add("active");
    showToast("Pedido pronto para entrega!");
  }, 6000);
}

/* RESET STATUS */
function resetSteps(){

  document.querySelectorAll("#statusPage .step").forEach(step=>{
    step.classList.remove("active");
  });

  document.querySelectorAll("#statusPage .line").forEach(line=>{
    line.classList.remove("active");
  });
}

/* TOAST */
function showToast(message){

  const toast = document.getElementById("toast");

  toast.innerHTML = message;
  toast.classList.add("show-toast");

  setTimeout(()=>{
    toast.classList.remove("show-toast");
  },3000);
}

/* LOGOUT */
function logout(){

  localStorage.removeItem("loja");

  document.getElementById("appPage").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";
}

/* INIT */
window.addEventListener("load", () => {

  const loja = localStorage.getItem("loja");

  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("storePage").style.display = "none";
  document.getElementById("appPage").style.display = "none";

  if (loja) {
    document.getElementById("storeName").innerText = loja;
  }
});