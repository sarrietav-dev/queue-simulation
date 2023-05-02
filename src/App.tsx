import { useEffect, useState } from "react";
import "./App.css";
import Modal from "./components/Modal";
import { Chance } from "chance";
import { DistributionForm } from "./components/DistributionForm";
import { ResultsModal } from "./components/ResultsModal";
import { Simulation, SimulationBuilder } from "./core/models/Simulation";
import { ArrivalIterator } from "./core/models/ArrivalIterator";
import { Exponential } from "./core/distributions/exponential";
import { Uniform } from "./core/distributions/uniform";
import { Poisson } from "./core/distributions/poisson";
import { Random } from "./utils/random";
import { Station } from "./core/models/Station";
import { Server as DomainServer } from "./core/models/Server";

function App() {
  const chance = new Chance.Chance();

  const [resultModal, setResultModal] = useState<boolean>(false);
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

  const [entryDistribution, setEntryDistribution] = useState<DistributionData>({
    name: "exponential",
    mean: {
      mean: "20",
    },
  });

  const [options, setOptions] = useState<{
    simulationTime: number;
    simulationRuns: number;
  }>({
    simulationTime: 60,
    simulationRuns: 1,
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (prefersDark) {
      setIsDarkMode(true);
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  const handleDarkMode = () => {
    setIsDarkMode((prev) => {
      if (!prev) {
        document.documentElement.dataset.theme = "dark";
      } else {
        document.documentElement.dataset.theme = "light";
      }

      return !prev;
    });
  };

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

  const handleSubmit = () => {
    const simulations: Simulation[] = [];

    for (let i = 0; i < options.simulationRuns; i++) {
      const simulation = new SimulationBuilder()
        .setArrivalIterator(
          new ArrivalIterator(
            getDistribution(entryDistribution.name),
            new Random()
          )
        )
        .setTimeStop(options.simulationTime)
        .setStations(buildStations())
        .build();

      simulations.push(simulation);
    }

    const longestQueues: {
      station: number[];
      length: number;
    }[] = [];

    const times: number[] = [];

    simulations.forEach((simulation) => {
      const results = simulation.run();
      console.log(results);

      longestQueues.push(results.longestQueue);
      times.push(results.time);
    });

    const averageTime = times.reduce((a, b) => a + b, 0) / times.length;

    // Get the mode of the longest queues stations
    const longestQueuesStations: number[] = [];

    longestQueues.forEach((queue) => {
      queue.station.forEach((station) => {
        longestQueuesStations.push(station);
      });
    });

    const mode = longestQueuesStations
      .sort(
        (a, b) =>
          longestQueuesStations.filter((v) => v === a).length -
          longestQueuesStations.filter((v) => v === b).length
      )
      .pop();

    const modeCount = longestQueuesStations.filter((v) => v === mode).length;

    const averageLongestQueue =
      longestQueues.reduce((a, b) => a + b.length, 0) / longestQueues.length;

    setResults({
      timeSpent: averageTime,
      longestQueue: {
        size: averageLongestQueue,
        station: [mode as number],
      },
    });

    setResultModal(true);
  };

  const [results, setResults] = useState<{
    timeSpent: number;
    longestQueue: { size: number; station: number[] };
  }>({
    timeSpent: 0,
    longestQueue: { size: 0, station: [] },
  });

  const getDistribution = (name: DistributionName) => {
    switch (name) {
      case "exponential":
        return new Exponential(Number(entryDistribution.mean));
      case "uniform":
        return new Uniform(
          Number((entryDistribution.mean as UniformMean).a),
          Number((entryDistribution.mean as UniformMean).b)
        );
      case "poisson":
        return new Poisson(Number(entryDistribution.mean));
    }
  };

  const buildStations = (): Station[] => {
    return stations.map((station) => {
      return new Station(
        ...station.servers.map((server) => {
          return new DomainServer(
            getDistribution(server.distribution.name),
            new Random()
          );
        })
      );
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
            const station = prev.findIndex((v) => v.key === data.stationKey);

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
            <ul
              style={{
                cursor: "pointer",
              }}
              onClick={handleDarkMode}
            >
              <strong className="theme_button">
                {isDarkMode ? "🌞" : "🌚"}
              </strong>
            </ul>
          </nav>
        </section>
        <form onSubmit={handleSubmit}>
          <section>
            <h2>Tasa de llegada</h2>
            <DistributionForm
              data={entryDistribution}
              onChange={(data) => {
                setEntryDistribution(data);
              }}
            />
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
                    handleEditStation(index, stations.servers, stations.key)
                  }
                >
                  <h3>Estación {index}</h3>
                  <h4>
                    Servidores: <span>{stations.servers.length}</span>
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
                  value={options.simulationTime}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      simulationTime: Number(e.target.value),
                    }))
                  }
                />
              </label>
              <label htmlFor="simulation_count">
                Cantidad de simulaciones
                <input
                  type="number"
                  id="simulation_count"
                  value={options.simulationRuns}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      simulationRuns: Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>
          </section>
          <button type="submit">Iniciar simulacion</button>
        </form>
      </div>
      <ResultsModal
        modalState={{
          open: resultModal,
          setOpen: setResultModal,
        }}
        {...results}
      />
    </>
  );
}

export default App;
