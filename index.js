function Pessoa(altura, peso) {
    if (!altura || !peso) {
        throw new Error("Altura e peso são obrigatórios");
    }

    this.altura = altura;
    this.peso = peso;
}

function Nutricionista(altura, peso) {
    Pessoa.call(this, altura, peso);
    this.imc = function () {
        return this.peso / (this.altura * this.altura);
    };

    this.classificaIMC = function () {
        var imc = this.imc();
        if (imc < 18.5) {
            return "Abaixo do peso";
        }
        if (imc >= 18.5 && imc < 24.9) {
            return "Peso normal";
        }
        if (imc >= 25 && imc < 29.9) {
            return "Sobrepeso";
        }

        return "Obesidade";
    };
}
Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

function calculaImc(nutricionista) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/imc/calculate", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText;
            alert(response);
        }
    };
    xhr.send(JSON.stringify({ height: nutricionista.altura, weight: nutricionista.peso }));
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
    document.getElementById("imc").innerText =
        nutricionista.imc().toFixed(2) + " - " + nutricionista.classificaIMC();
    renderizaTabelaIMC(nutricionista.imc());
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
        calculaImc(nutricionista);
    }
}

window.onload = function () {
    document
        .getElementById("calcular")
        .addEventListener("click", actionCalcularIMCBuilder());
};
