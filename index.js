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
        this.imcVal = 0;
        this.imcLabel = "";
    }
    async imc() {
        return fetch("http://localhost:3000/imc/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ height: this.altura, weight: this.peso })
        })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao calcular IMC");
            return response.json();
        })
        .then(resp => {
            this.imcVal = resp.imc;
            this.imcLabel = resp.imcDescription;
            return resp;
        });
    }
    
    classificaIMC() {
        if (this.imcVal < 18.5) return "Abaixo do peso";
        if (this.imcVal >= 18.5 && this.imcVal < 24.9) return "Peso normal";
        if (this.imcVal >= 25 && this.imcVal < 29.9) return "Sobrepeso";
        return "Obesidade";
    }
}

function renderizaResultadoIMC(nutricionista) {
    nutricionista.imc().then(resp => {
        document.getElementById("imc").innerText = `${resp.imc.toFixed(2)} - ${resp.imcDescription}`;
        renderizaTabelaIMC(nutricionista.imcVal);
    });
}

function renderizaTabelaIMC(valorIMC) {
    const intervalos = [
        { min: 0, max: 18.5, texto: "Abaixo do peso" },
        { min: 18.5, max: 24.9, texto: "Peso normal" },
        { min: 25, max: 29.9, texto: "Sobrepeso" },
        { min: 29.9, max: Infinity, texto: "Obesidade" }
    ];
    let html = `<table id="tabela-imc" style="width:100%;border-collapse:collapse;">`;
    html += `<tr><th>Intervalo IMC</th><th>Classificação</th></tr>`;
    for (const intervalo of intervalos) {
        const destaque = (valorIMC >= intervalo.min && valorIMC < intervalo.max) ? 'class="destaque-imc"' : '';
        const maxTexto = intervalo.max === Infinity ? "ou mais" : intervalo.max;
        html += `<tr ${destaque}><td>${intervalo.min} - ${maxTexto}</td><td>${intervalo.texto}</td></tr>`;
    }
    html += `</table>`;
    document.getElementById("tabela-imc-container").innerHTML = html;
}

function actionCalcularIMCBuilder() {
    const alturaEl = document.getElementById("altura");
    const pesoEl = document.getElementById("peso");

    return function actionCalcularIMC(evt) {
        evt.preventDefault();
        const nutricionista = new Nutricionista(
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
