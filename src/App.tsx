import { useRef, useState } from "react";
import "./App.css";
import Modal from "./components/Modal";
import { Chance } from "chance";

function App() {
    const chance = new Chance.Chance();

    const [stations, setStations] = useState<
        { key: string; servers: Server[] }[]
    >([
        {
            key: chance.guid(),
            servers: [
                {
                    distribution: {
                        mean: {
                            mean: "20",
                        },
                        name: "exponential",
                    },
                },
            ],
        },
    ]);

    const [editingStation, setEditingStation] = useState<{
        id: number;
        key: string;
        servers: Server[];
    }>({ id: 0, servers: [], key: "" });

    const [modalShown, setModalShown] = useState<boolean>(false);

    const handleEditStation = (id: number, servers: Server[], key: string) => {
        setModalShown(true);
        setEditingStation({
            id,
            servers: servers,
            key,
        });
    };

    const handleCreateNewStation = () => {
        if (stations.length === 4) return;

        const newStation: { key: string; servers: Server[] } = {
            key: chance.guid(),
            servers: [
                {
                    distribution: {
                        mean: {
                            mean: "20",
                        },
                        name: "exponential",
                    },
                },
            ],
        };

        setStations((prev) => [...prev, newStation]);
        setModalShown(true);
        setEditingStation({
            id: stations.length - 1,
            servers: newStation.servers,
            key: newStation.key,
        });
    };

    return (
        <>
            <Modal
                modalState={{ open: modalShown, setOpen: setModalShown }}
                data={{
                    stationId: editingStation.id,
                    stationKey: editingStation.key,
                    servers: editingStation.servers,
                }}
                onSave={(data) => {
                    setStations((prev) => {
                        const newStations = [...prev];
                        const station = prev.findIndex(
                            (v) => v.key === data.stationKey
                        );

                        if (station === -1) return prev;

                        newStations[station] = {
                            key: data.stationKey,
                            servers: data.servers,
                        };

                        return newStations;
                    });
                }}
            />
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
                <form>
                    <section>
                        <h2>Tasa de llegada</h2>
                        <div className="grid">
                            <label htmlFor="entry_distribution">
                                Distribución de llegada
                                <select id="entry_distribution">
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
                            <button
                                onClick={handleCreateNewStation}
                                disabled={stations.length === 4}
                                role="button"
                            >
                                Agregar mas estaciones
                            </button>
                        </header>
                        <div className="grid">
                            {stations.map((stations, index) => (
                                <article
                                    key={stations.key}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        handleEditStation(
                                            index,
                                            stations.servers,
                                            stations.key
                                        )
                                    }
                                >
                                    <h3>Estación {index}</h3>
                                    <h4>
                                        Servidores:{" "}
                                        <span>{stations.servers.length}</span>
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
