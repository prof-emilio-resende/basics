function Pessoa(altura, peso) {
    if (!altura && !peso) {
        throw new Error("Altura e peso são obrigatórios");
    }

    this.altura = parseFloat(altura);
    this.peso = parseFloat(peso);
}

function Nutricionista(altura, peso) {
    Pessoa.call(this, altura, peso);
    this.imc = function () {
        return this.peso / (this.altura * this.altura);
    };

    this.getImcFromAPI = async function () {
        const response = await fetch(`http://localhost:3000/imc/calculate`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                height: this.altura,
                weight: this.peso
            })
        });
        const data = await response.json();
        return parseFloat(data.imc);
    };

    this.classificaIMC = async function () {
        document.querySelectorAll("tbody tr").forEach(function (tr) {
            tr.classList.remove("result");
        });

        var imc = await this.getImcFromAPI();
        console.log("==>", imc);
        if (imc < 18.5) {
            document.querySelector(".level1").classList.add("result");
        }

        if (imc >= 18.5 && imc < 24.9) {
            document.querySelector(".level2").classList.add("result");
        }

        if (imc >= 25 && imc < 29.9) {
            document.querySelector(".level3").classList.add("result");
        }

        if (imc >= 30) {
            document.querySelector(".level4").classList.add("result");
        }
    };
}

Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

function actionCalcularIMCBuilder() {
    var alturaEl = document.getElementById("altura");
    var pesoEl = document.getElementById("peso");

    return function actionCalcularIMC(evt) {
        evt.preventDefault();
        var nutricionista = new Nutricionista(alturaEl.value, pesoEl.value);
        nutricionista.classificaIMC();
    }
}

window.onload = function () {
    document
        .getElementById("calcular")
        .addEventListener("click", actionCalcularIMCBuilder());
};
