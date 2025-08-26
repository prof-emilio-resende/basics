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

function renderizaResultadoIMC(nutricionista) {
    document.getElementById("imc").innerText =
        nutricionista.imc().toFixed(2) + " - " + nutricionista.classificaIMC();
    renderizaTabelaIMC(nutricionista.imc());
}

function renderizaTabelaIMC(valorIMC) {
    var intervalos = [
        { min: 0, max: 18.5, texto: "Abaixo do peso" },
        { min: 18.5, max: 24.9, texto: "Peso normal" },
        { min: 25, max: 29.9, texto: "Sobrepeso" },
        { min: 29.9, max: Infinity, texto: "Obesidade" }
    ];
    var html = '<table id="tabela-imc" style="width:100%;border-collapse:collapse;">';
    html += '<tr><th>Intervalo IMC</th><th>Classificação</th></tr>';
    for (var i = 0; i < intervalos.length; i++) {
        var intervalo = intervalos[i];
        var destaque = (valorIMC >= intervalo.min && valorIMC < intervalo.max) ? 'class="destaque-imc"' : '';
        var maxTexto = intervalo.max === Infinity ? "ou mais" : intervalo.max;
        html += '<tr ' + destaque + '>' +
            '<td>' + intervalo.min + ' - ' + maxTexto + '</td>' +
            '<td>' + intervalo.texto + '</td>' +
            '</tr>';
    }
    html += '</table>';
    document.getElementById("tabela-imc-container").innerHTML = html;
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
