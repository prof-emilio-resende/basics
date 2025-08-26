function Pessoa(altura, peso) {
    if (!altura || !peso) {
        throw new Error("Altura e peso são obrigatórios");
    }

    this.altura = altura;
    this.peso = peso;
}

function Nutricionista(altura, peso) {
    Pessoa.call(this, altura, peso);
    this.imcVal = 0;
    this.imcLabel = "";
    this.imc = function (callback) {
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/imc/calculate", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                self.imcVal = resp.imc;
                self.imcLabel = resp.imcDescription;
                callback(resp.imc, resp.imcDescription);
            }
        };
        xhr.send(JSON.stringify({ height: this.altura, weight: this.peso }));
    };

    this.classificaIMC = function () {
        if (this.imcVal < 18.5) {
            return "Abaixo do peso";
        }
        if (this.imcVal >= 18.5 && this.imcVal < 24.9) {
            return "Peso normal";
        }
        if (this.imcVal >= 25 && this.imcVal < 29.9) {
            return "Sobrepeso";
        }

        return "Obesidade";
    };
}
Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

function renderizaResultadoIMC(nutricionista) {
    nutricionista.imc(function(imc, imcDescription) {
        document.getElementById("imc").innerText = imc.toFixed(2) + " - " + imcDescription;
        renderizaTabelaIMC(nutricionista.imcVal);
    });
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
