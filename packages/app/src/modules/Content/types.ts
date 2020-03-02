// Types
export interface Resource {
  id: string;
  textKey: string;
  url: string;
  context: string;
}

export interface Content {
  resources: Resource[];
}

// Guards
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isResource = (resource: any): resource is Resource =>
  resource &&
  typeof resource === 'object' &&
  typeof resource.url === 'string' &&
  typeof resource.textKey === 'string' &&
  typeof resource.id === 'string' &&
  typeof resource.context === 'string';
