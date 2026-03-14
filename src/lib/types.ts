export interface ChainEvent {
  chain: string;
  tx_hash: string;
  events: any[]; // The normalized events from ChainMerge SDK
}

export interface AgentAction {
  id: string;
  timestamp: string;
  module: 'LEVIATHAN' | 'PHANTOM_AUDITOR' | 'TREASURY_CFO';
  inputEvent: ChainEvent;
  reasoning: string;
  executionPayload: any;
  status: 'ANALYZING' | 'EXECUTED' | 'FAILED' | 'REJECTED';
  pnlImpact: number;
  narrative?: string;
  decodedPayload?: string;
  governance?: {
    status: 'PENDING' | 'PASSED' | 'REJECTED';
    reasoning: string;
    riskScore: number;
  };
}
