// IntegrationStore.ts
type IntegrationData = {
  host: string;
  secret: string;
};

const integrationStore = new Map<string, IntegrationData>();

function setIntegration(id: string, host: string, secret: string) {
  integrationStore.set(id, { host, secret });
}

function getIntegration(id: string): IntegrationData | null {
  const data = integrationStore.get(id);
  return data || null;
}

export { setIntegration, getIntegration };
