function App() {
    return (
        <div className="container">
            <h1>Simulador</h1>
            <form action="">
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
            </form>
        </div>
    );
}

export default App;
