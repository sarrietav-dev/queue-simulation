import { useState } from "react";
import DistributionForm from "./DistributionForm";

type ModalProps = {
    open?: boolean;
    data?: ModalData;
    onSave?: () => void;
};

type ModalData = {
    stationId: number;
    servers: Server[];
};

function Modal(props: ModalProps) {
    let initialData: Server[] = [
        {
            distribution: {
                name: "uniform",
                mean: {
                    a: "0.0",
                    b: "0.0",
                },
            },
        },
    ];

    if (props.data && props.data.servers.length !== 0) {
        initialData = props.data.servers;
    }

    const [servers, setServers] = useState<Server[]>(initialData);
    const [sameDist, setSameDist] = useState<boolean>(false);

    const handleCreateServer = () => {
        if (servers.length === 4) return;
        setServers((prev) => {
            return [
                ...prev,
                {
                    distribution: {
                        name: "uniform",
                        mean: {
                            a: "0.0",
                            b: "0.0",
                        },
                    },
                },
            ];
        });
    };

    const handleSameDistributionCheck = () => {
        setSameDist((prev) => {
            return !prev;
        });

        setServers((prev) => {
            if (prev.length === 0) return prev;
            return prev.map((server) => {
                return {
                    ...server,
                    distribution: {
                        ...prev[0].distribution,
                    },
                };
            });
        });
    };

    return (
        <dialog open={props.open}>
            <article
                style={{
                    minWidth: "50%",
                }}
            >
                <header>Estación {props.data?.stationId}</header>
                <section className="stations_header">
                    <h2 style={{ margin: 0 }}>
                        Servidores {sameDist && <span>{servers.length}</span>}
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <button
                            disabled={servers.length === 4}
                            role="button"
                            onClick={handleCreateServer}
                        >
                            Agregar mas servidores
                        </button>
                        <label htmlFor="same_dist">
                            <input
                                type="checkbox"
                                checked={sameDist}
                                onChange={handleSameDistributionCheck}
                                name=""
                                id="same_dist"
                            />
                            Misma distribución?
                        </label>
                    </div>
                </section>
                {!sameDist ? (
                    <div>
                        {servers.map((server, index) => (
                            <section key={index}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <h3>Servidor: {index}</h3>
                                    <a
                                        href="#"
                                        role="button"
                                        className="secondary"
                                    >
                                        Delete
                                    </a>
                                </div>
                                <DistributionForm
                                    data={server.distribution}
                                    onChange={(data) => {
                                        setServers((prev) => {
                                            const newServers = [...prev];
                                            newServers[index].distribution =
                                                data;
                                            return newServers;
                                        });
                                    }}
                                />
                            </section>
                        ))}
                    </div>
                ) : (
                    <DistributionForm
                        data={servers[0].distribution ?? { name }}
                        onChange={(data) => {
                            setServers((prev) => {
                                const newServers = [...prev];
                                console.log(data);
                                newServers.forEach((server) => {
                                    server.distribution = data;
                                });
                                return newServers;
                            });
                        }}
                    />
                )}
                <footer>
                    <a href="#cancel" role="button" className="secondary">
                        Cancel
                    </a>
                    <a href="#confirm" role="button">
                        Confirm
                    </a>
                </footer>
            </article>
        </dialog>
    );
}

export default Modal;
