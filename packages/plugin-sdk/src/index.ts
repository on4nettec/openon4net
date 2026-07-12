/**
 * Types + in-memory manifest-building only — matches docs/spect/02_ARCHITECTURE/03-skill-engine.md §5.
 * No sandboxed execution: Runtime does not load or run a built Plugin yet (see 09-plugin-sandbox.md).
 */

export interface PluginContext {
  config: Record<string, unknown>;
  tools: Record<string, (params: Record<string, unknown>) => Promise<unknown>>;
  memory: {
    read: (key: string) => Promise<unknown>;
    write: (key: string, value: unknown) => Promise<void>;
  };
}

export interface ToolParameterDef {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  description?: string;
}

export interface ToolDefinition {
  description: string;
  parameters: Record<string, ToolParameterDef>;
  execute: (params: Record<string, unknown>, context: PluginContext) => Promise<unknown>;
}

export interface ActionDefinition {
  description: string;
  execute: (params: Record<string, unknown>, context: PluginContext) => Promise<unknown>;
}

export interface PluginDefinition {
  id: string;
  name: string;
}

export class Plugin {
  readonly id: string;
  readonly name: string;
  readonly tools = new Map<string, ToolDefinition>();
  readonly actions = new Map<string, ActionDefinition>();

  constructor(definition: PluginDefinition) {
    this.id = definition.id;
    this.name = definition.name;
  }

  defineTool(name: string, definition: ToolDefinition): this {
    this.tools.set(name, definition);
    return this;
  }

  defineAction(name: string, definition: ActionDefinition): this {
    this.actions.set(name, definition);
    return this;
  }
}

export function createPlugin(definition: PluginDefinition): Plugin {
  return new Plugin(definition);
}

export type Tool = ToolDefinition;
export type Action = ActionDefinition;
