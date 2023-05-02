type Server = {
    distribution: DistributionData;
};

type DistributionData = {
    name: DistributionName;
    mean: DistributionMean;
};

type DistributionName = "exponential" | "uniform" | "poisson";

type DistributionMean = { mean: string } | { a: string; b: string };

type UniformMean = { a: string; b: string };

type Mean = { mean: string };
