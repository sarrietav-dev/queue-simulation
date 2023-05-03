
type DistributionData = {
  name: DistributionName;
  mean: DistributionMean;
};

type DistributionName = "exponential" | "uniform" | "poisson";

type DistributionMean = { mean: number } | { a: number; b: number };

type UniformMean = { a: number; b: number };

type Mean = { mean: number };
