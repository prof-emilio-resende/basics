class Pessoa {
    protected altura: number;
    protected peso: number;

    constructor(altura: number, peso: number) {
        if (!altura || !peso) {
            throw new Error("Altura e peso são obrigatórios");
        }
        this.altura = altura;
        this.peso = peso;
    }
}

class Nutricionista extends Pessoa {
    public imcVal: number;
    public imcLabel: string;

    constructor(altura: number, peso: number) {
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
            console.log(resp);
            this.imcVal = resp.imc;
            this.imcLabel = resp.imcDescription;
            return resp;
        });
    }
}

function renderizaResultadoIMC(nutricionista: Nutricionista) {
    nutricionista.imc().then(resp => {
        document.getElementById("imc")!.innerText = `${resp.imc.toFixed(2)} - ${resp.imcDescription}`;
        renderizaTabelaIMC(nutricionista.imcVal);
    });
}

function renderizaTabelaIMC(valorIMC: number) {
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
    document.getElementById("tabela-imc-container")!.innerHTML = html;
}

export function actionCalcularIMCBuilder(evt: SubmitEvent) {
    console.log("actionCalcularIMC");
    evt.preventDefault();
    const form = evt.currentTarget as HTMLFormElement | null;
    const alturaEl = (form?.querySelector('#altura') ?? document.getElementById('altura')) as HTMLInputElement | null;
    const pesoEl = (form?.querySelector('#peso') ?? document.getElementById('peso')) as HTMLInputElement | null;

    const altura = parseFloat(alturaEl?.value ?? '');
    const peso = parseFloat(pesoEl?.value ?? '');

    if (Number.isNaN(altura) || Number.isNaN(peso)) {
        console.error('Valores inválidos para altura ou peso');
        return;
    }

    const nutricionista = new Nutricionista(altura, peso);
    renderizaResultadoIMC(nutricionista);
}
