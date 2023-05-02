import React, { useState } from "react";
import NumberInput from "./NumberInput";

type DistributionFormProps = {
  data: DistributionData;
  onChange: (data: DistributionData) => void;
};

export function DistributionForm({ data, onChange }: DistributionFormProps) {
  const [distribution, setDistribution] = useState<DistributionName>(
    data.name ?? "exponential"
  );
  const [mean, setMean] = useState<Mean>(
    data.name !== "uniform"
      ? { mean: (data.mean as Mean).mean ?? "0" }
      : { mean: "0" }
  );
  const [uniformMean, setUniformMean] = useState<UniformMean>(
    data.name === "uniform"
      ? {
          a: (data.mean as UniformMean).a ?? "0",
          b: (data.mean as UniformMean).b ?? "0",
        }
      : { a: "0", b: "0" }
  );

  const handleDistributionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDistribution(() => {
      const newDistribution = event.target.value as DistributionName;

      onChange({
        name: newDistribution,
        mean: newDistribution === "uniform" ? uniformMean : mean,
      });

      return newDistribution;
    });
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
          <option value="uniform">Uniforme</option>
          <option value="exponential">Exponencial</option>
          <option value="poisson">Poisson</option>
        </select>
      </label>
      {distribution === "uniform" ? (
        <>
          <label htmlFor="">
            a
            <NumberInput
              value={uniformMean.a}
              onChange={(e) => {
                setUniformMean((prev) => {
                  onChange({
                    name: "uniform",
                    mean: {
                      a: e,
                      b: prev.b,
                    },
                  });

                  return {
                    ...prev,
                    a: e,
                  };
                });
              }}
            />
          </label>
          <label htmlFor="">
            b
            <NumberInput
              value={uniformMean.b}
              onChange={(e) => {
                setUniformMean((prev) => {
                  onChange({
                    name: "uniform",
                    mean: {
                      a: prev.a,
                      b: e,
                    },
                  });
                  return {
                    ...prev,
                    b: e,
                  };
                });
              }}
            />
          </label>
        </>
      ) : (
        <label>
          Media
          <NumberInput
            value={mean.mean}
            onChange={(value) => {
              setMean((prev) => {
                onChange({
                  name: distribution,
                  mean: { mean: value },
                });

                return {
                  ...prev,
                  mean: value,
                };
              });
            }}
          />
        </label>
      )}
    </div>
  );
}
