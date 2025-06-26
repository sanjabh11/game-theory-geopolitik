import React, { useEffect, useState } from "react";
import { geminiApi } from "../services/geminiApi";
import { Scenario, ScenarioOutcome } from "../types/api";

const ScenarioSimulationComponent: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial setup if needed
  }, []);

  const simulateScenario = async (scenarioId: string) => {
    setLoading(true);
    setError(null);
    try {
      const scenario = scenarios.find((s) => s.id === scenarioId);
      if (!scenario) throw new Error("Scenario not found");

      const response = await geminiApi.generateScenarioOutcomes({
        title: scenario.title,
        description: scenario.description,
        parameters: scenario.parameters,
        region: scenario.region,
      });

      if (!response.success || !response.data) throw new Error(response.error || "Failed to simulate outcomes");

      // Transform the response outcomes to match ScenarioOutcome interface
      const transformedOutcomes: ScenarioOutcome[] = response.data?.outcomes?.map((outcome: any, index: number) => ({
        id: `outcome-${scenarioId}-${index}`,
        title: outcome.title,
        description: outcome.description,
        probability: outcome.probability,
        impact: (outcome.impact && ['low', 'medium', 'high', 'critical'].includes(outcome.impact)) 
          ? outcome.impact 
          : 'medium' as 'low' | 'medium' | 'high' | 'critical',
        timeframe: outcome.timeframe,
        consequences: outcome.consequences || ['Impact analysis pending'],
        mitigation: outcome.mitigation || ['Mitigation strategies to be determined']
      })) || [];

      const updatedScenarios = scenarios.map((s) =>
        s.id === scenarioId
          ? {
              ...s,
              outcomes: transformedOutcomes,
              status: "active" as const,
            }
          : s
      );

      setScenarios(updatedScenarios);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Scenario Simulation</h1>
      {loading && <p>Simulating...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            <h3>{scenario.title}</h3>
            <p>{scenario.description}</p>
            <button onClick={() => simulateScenario(scenario.id)}>Simulate</button>
            <ul>
              {scenario.outcomes.map((outcome: ScenarioOutcome) => (
                <li key={outcome.id}>
                  <strong>{outcome.title}</strong>
                  <p>Probability: {outcome.probability}%</p>
                  <p>Impact: {outcome.impact}</p>
                  <p>{outcome.description}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScenarioSimulationComponent;

