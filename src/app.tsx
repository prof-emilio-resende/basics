// @ts-ignore
import { h, Fragment } from './jsx-runtime';
import {actionCalcularIMCBuilder} from "./index.tsx";

export function App() {
    return (
        <div className="container">
            <div className="data">
                <div className="form">
                    <form id="appForm" onSubmit={actionCalcularIMCBuilder}>
                        <div className="row">
                            <label>Altura:</label>
                            <input type="text" id="altura" placeholder="Digite sua altura (em metros)"/>
                        </div>
                        <div className="row">
                            <label>Peso:</label>
                            <input type="text" id="peso" placeholder="Digite seu peso (em kg)"/>
                        </div>
                        <div className="row">
                            <button type="submit" id="calcular">Calcular IMC</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="data">
                <p>Seu IMC &eacute; <span id="imc"></span></p>
                <div id="tabela-imc-container"></div>
            </div>
        </div>
    );
}

document.getElementById("root")?.appendChild(<App />);
