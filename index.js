function Pessoa(altura, peso) {
    if (!altura || !peso) {
        throw new Error("Altura e peso são obrigatórios");
    }

    this.altura = altura;
    this.peso = peso;
}

function Nutricionista(altura, peso) {
    Pessoa.call(this, altura, peso);
    this.valorImc = 0;
    this.descricaoImc = "";

    this.imc = async function () {
        var self = this;
        return calculaImc(this)
            .then(function (imc) {
                console.log('----- Nutricionista->imc -----');
                console.log(imc);
                console.log(this);
                console.log(self);
                self.valorImc = imc.imc;
                self.descricaoImc = imc.imcDescription;
            });
    };
}
Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

function calculaImc(nutricionista) {
    return fetch("http://localhost:3000/imc/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ height: nutricionista.altura, weight: nutricionista.peso })
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Erro ao calcular IMC");
            }
        });
}

function renderizaTabelaIMC(imc) {
   var intervalos = [
       { min: 0, max: 18.4, classificacao: "Abaixo do peso" },
       { min: 18.4, max: 24.9, classificacao: "Peso normal" },
       { min: 24.9, max: 29.9, classificacao: "Sobrepeso" },
       { min: 29.9, max: Infinity, classificacao: "Obesidade" }
   ];

   var html = "<table id='tabela-imc'><thead><tr><th>Classifica&ccedil;&atilde;o</th><th>IMC</th></tr></thead><tbody>";
   intervalos.forEach(function(x) {
       var row = "<tr class='destaque-imc-placeholder'><td>{{classificacao}}</td><td>{{intervalo}}</td></tr>"
       var intervalo = x.min + " - " + x.max;
       if (imc >= x.min && imc < x.max) row = row.replace("destaque-imc-placeholder", "destaque-imc");
       html += row.replace("{{intervalo}}", intervalo).replace("{{classificacao}}", x.classificacao);
   });
   html += "</tbody></table>";
   document.getElementById("tabela-imc-container").innerHTML = html;
}

function renderizaResultadoIMC(nutricionista) {
    nutricionista.imc()
        .then(function() {
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

        var nutricionista = new Nutricionista(
            parseFloat(alturaEl.value),
            parseFloat(pesoEl.value)
        );
        console.log(Nutricionista.prototype.constructor);
        console.log(nutricionista instanceof Pessoa);

        renderizaResultadoIMC(nutricionista);
    }
}

window.onload = function () {
    document
        .getElementById("calcular")
        .addEventListener("click", actionCalcularIMCBuilder());
};
