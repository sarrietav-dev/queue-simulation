import { useState } from "react";
import DistributionForm from "./DistributionForm";
import Chance from "chance";

type ModalProps = {
    open?: boolean;
    data?: ModalData;
    onSave?: (servers: Server[]) => void;
};

type ModalData = {
    stationId: number;
    servers: Server[];
};

function Modal(props: ModalProps) {
    const chance = new Chance.Chance();
    let initialData: { server: Server; key: string }[] = [
        {
            key: chance.guid(),
            server: {
                distribution: {
                    name: "uniform",
                    mean: {
                        a: "0.0",
                        b: "0.0",
                    },
                },
            },
        },
    ];

    if (props.data && props.data.servers.length !== 0) {
        initialData = props.data.servers.map((server) => {
            return {
                server: server,
                key: chance.guid(),
            };
        });
    }

    const [servers, setServers] =
        useState<{ server: Server; key: string }[]>(initialData);
    const [sameDist, setSameDist] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(props.open ?? false);

    const handleCreateServer = () => {
        if (servers.length === 4) return;
        setServers((prev) => {
            return [
                ...prev,
                {
                    key: chance.guid(),
                    server: {
                        distribution: {
                            name: "uniform",
                            mean: {
                                a: "0.0",
                                b: "0.0",
                            },
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
            const newServers = prev.map((server) => {
                return {
                    ...server,
                    server: {
                        ...server.server,
                        distribution: {
                            ...server.server.distribution,
                            name: prev[0].server.distribution.name,
                        },
                    },
                };
            });

            return newServers;
        });
    };

    function handleDeleteServer(key: string) {
        setServers((prev) => {
            return prev.filter((server) => server.key !== key);
        });
    }

    return (
        <dialog open={open}>
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
                            <section key={server.key}>
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
                                        onClick={() =>
                                            handleDeleteServer(server.key)
                                        }
                                    >
                                        Delete
                                    </a>
                                </div>
                                <DistributionForm
                                    data={server.server.distribution}
                                    onChange={(data) => {
                                        setServers((prev) => {
                                            const newServers = [...prev];
                                            newServers[
                                                index
                                            ].server.distribution = data;
                                            return newServers;
                                        });
                                    }}
                                />
                            </section>
                        ))}
                    </div>
                ) : (
                    <DistributionForm
                        data={
                            servers[0].server.distribution ?? {
                                name: "uniform",
                                mean: { a: "0.0", b: "0.0" },
                            }
                        }
                        onChange={(data) => {
                            setServers((prev) => {
                                const newServers = [...prev];
                                console.log(data);
                                newServers.forEach((server) => {
                                    server.server.distribution = data;
                                });
                                return newServers;
                            });
                        }}
                    />
                )}
                <footer>
                    <a
                        href="#cancel"
                        role="button"
                        className="secondary"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </a>
                    <a
                        href="#confirm"
                        role="button"
                        onClick={() => {
                            props.onSave?.(
                                servers.map((server) => server.server)
                            );

                            setOpen(false);
                        }}
                    >
                        Confirm
                    </a>
                </footer>
            </article>
        </dialog>
    );
}

export default Modal;
