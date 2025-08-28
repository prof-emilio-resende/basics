class Pessoa {
    constructor(altura, peso) {
        if (!altura || !peso) {
            throw new Error("Altura e peso são obrigatórios");
        }

        this.altura = altura;
        this.peso = peso;
    }
}

class Nutricionista extends Pessoa {
    constructor(altura, peso) {
        super(altura, peso);
        this.valorImc = 0;
        this.descricaoImc = "";
    }

    imc = async function () {
        return calculaImc(this)
            .then((imc) => {
                console.log('----- Nutricionista->imc=> -----');
                console.log(imc);
                console.log(this);
                this.valorImc = imc.imc;
                this.descricaoImc = imc.imcDescription;
            });
    };
}

function calculaImc(nutricionista) {
    return fetch("http://localhost:3000/imc/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ height: nutricionista.altura, weight: nutricionista.peso })
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erro ao calcular IMC");
            }
        });
}

function renderizaTabelaIMC(imc) {
   const intervalos = [
       { min: 0, max: 18.4, classificacao: "Abaixo do peso" },
       { min: 18.4, max: 24.9, classificacao: "Peso normal" },
       { min: 24.9, max: 29.9, classificacao: "Sobrepeso" },
       { min: 29.9, max: Infinity, classificacao: "Obesidade" }
   ];

   let html = "<table id='tabela-imc'><thead><tr><th>Classifica&ccedil;&atilde;o</th><th>IMC</th></tr></thead><tbody>";
   intervalos.forEach((x) => {
       const intervalo = x.min + " - " + x.max;
       html += `<tr class='${(imc >= x.min && imc < x.max) ? "destaque-imc" : ""}'><td>${x.classificacao}</td><td>${intervalo}</td></tr>`
   });
   html += "</tbody></table>";
   document.getElementById("tabela-imc-container").innerHTML = html;
}

function renderizaResultadoIMC(nutricionista) {
    nutricionista.imc()
        .then(() => {
            document.getElementById("imc").innerText =
                nutricionista.valorImc + " - " + nutricionista.descricaoImc;
            renderizaTabelaIMC(parseFloat(nutricionista.valorImc));
        });
}

function actionCalcularIMCBuilder() {
    var alturaEl = document.getElementById("altura");
    var pesoEl = document.getElementById("peso");

    return function actionCalcularIMC(evt) {
        evt.preventDefault();

        const nutricionista = new Nutricionista(
            parseFloat(alturaEl.value),
            parseFloat(pesoEl.value)
        );
        renderizaResultadoIMC(nutricionista);
    }
}

window.onload = function () {
    document
        .getElementById("calcular")
        .addEventListener("click", actionCalcularIMCBuilder());
};
