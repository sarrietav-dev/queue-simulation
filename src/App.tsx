import "./App.css";

function App() {
    return (
        <>
            <div className="container">
                <section>
                    <nav>
                        <ul>
                            <li>
                                <strong>Simulador</strong>
                            </li>
                        </ul>
                        <ul>
                            <strong className="theme_button">🌞</strong>
                        </ul>
                    </nav>
                </section>
                <form action="">
                    <section>
                        <h2>Tasa de llegada</h2>
                        <div className="grid">
                            <label htmlFor="entry_distribution">
                                Distribución de llegada
                                <select name="" id="entry_distribution">
                                    <option value="" selected>
                                        Selecciona una distribución
                                    </option>
                                    <option value="1">Uniforme</option>
                                    <option value="2">Exponencial</option>
                                    <option value="3">Poisson</option>
                                </select>
                            </label>
                            <label htmlFor="entry_mean">
                                Media
                                <input type="text" name="" id="entry_mean" />
                            </label>
                        </div>
                    </section>
                    <section>
                        <header className="stations_header">
                            <h2>Estaciones</h2>
                            <button role="button">
                                Agregar mas estaciones
                            </button>
                        </header>
                        <div className="grid">
                            {[0, 1, 2, 4].map((index) => (
                                <article key={index}>
                                    <h3>Estación {index}</h3>
                                    <h4>
                                        Servidores: <span>4</span>
                                    </h4>
                                </article>
                            ))}
                        </div>
                    </section>
                    <section>
                        <header>
                            <h2>Otras opciones</h2>
                        </header>
                        <div className="grid">
                            <label htmlFor="simulation_duration">
                                Duración de la simulación
                                <input
                                    type="number"
                                    id="simulation_duration"
                                    value={60}
                                />
                            </label>
                            <label htmlFor="simulation_count">
                                Cantidad de simulaciones
                                <input
                                    type="number"
                                    id="simulation_count"
                                    value={1}
                                />
                            </label>
                        </div>
                    </section>
                    <button type="submit">Iniciar simulacion</button>
                </form>
            </div>
        </>
    );
}

export default App;
