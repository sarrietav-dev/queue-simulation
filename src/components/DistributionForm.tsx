import React, { useState } from "react";

type DistributionFormProps = {
    data: DistributionData;
    onChange: (data: DistributionData) => void;
};

function DistributionForm({ data, onChange }: DistributionFormProps) {
    const [distribution, setDistribution] = useState<DistributionName>(
        data.name ?? "exponential"
    );
    const [mean, setMean] = useState<{ mean: number }>(
        data.name !== "uniform"
            ? { mean: (data.mean as Mean).mean ?? 0 }
            : { mean: 0 }
    );
    const [exponentialMean, setExponentialMean] = useState<{
        a: number;
        b: number;
    }>(
        data.name === "uniform"
            ? {
                  a: (data.mean as UniformMean).a ?? 0,
                  b: (data.mean as UniformMean).b ?? 0,
              }
            : { a: 0, b: 0 }
    );

    const handleDistributionChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDistribution(event.target.value as DistributionName);
    };

    return (
        <div className="grid">
            <label htmlFor="entry_distribution">
                Distribución
                <select
                    value={distribution}
                    name=""
                    id="entry_distribution"
                    onChange={handleDistributionChange}
                >
                    <option value="" selected>
                        Selecciona una distribución
                    </option>
                    <option value="uniform">Uniforme</option>
                    <option value="exponential">Exponencial</option>
                    <option value="poisson">Poisson</option>
                </select>
            </label>
            {distribution === "uniform" ? (
                <>
                    <label htmlFor="">
                        a
                        <input
                            type="text"
                            name=""
                            id=""
                            value={exponentialMean.a}
                            onChange={(e) => {
                                setExponentialMean((prev) => {
                                    onChange({
                                        name: "uniform",
                                        mean: {
                                            a: Number(e.target.value),
                                            b: prev.b,
                                        },
                                    });

                                    return {
                                        ...prev,
                                        a: Number(e.target.value),
                                    };
                                });
                            }}
                        />
                    </label>
                    <label htmlFor="">
                        b
                        <input
                            type="text"
                            name=""
                            id=""
                            value={exponentialMean.b}
                            onChange={(e) => {
                                setExponentialMean((prev) => {
                                    onChange({
                                        name: "uniform",
                                        mean: {
                                            a: prev.a,
                                            b: Number(e.target.value),
                                        },
                                    });
                                    return {
                                        ...prev,
                                        b: Number(e.target.value),
                                    };
                                });
                            }}
                        />
                    </label>
                </>
            ) : (
                <label>
                    Media
                    <input
                        type="text"
                        name=""
                        id=""
                        value={mean.mean}
                        onChange={(e) => {
                            setMean((prev) => {
                                onChange({
                                    name: distribution,
                                    mean: { mean: Number(e.target.value) },
                                });

                                return {
                                    ...prev,
                                    mean: Number(e.target.value),
                                };
                            });
                        }}
                    />
                </label>
            )}
        </div>
    );
}

export default DistributionForm;
