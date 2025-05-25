export enum BlockType {
  INPUT = 'input',
  RADIO = 'radio',
  BUTTON = 'button',
  CODE = 'code'
}

export interface InputBlock {
  type: BlockType.INPUT;
  heading: string;
  placeholder: string;
  description?: string;
  canAskAI?: boolean;
  key: string;
}

export interface RadioBlock {
  type: BlockType.RADIO;
  options: string[];
  description?: string;
  canAskAI?: boolean;
  key: string;
  subfields?: {
    name: string,
    field: string
  }[],
}

export interface ButtonBlock {
  type: BlockType.BUTTON;
  name: string;
  value: string;
  description?: string;
  canAskAI?: boolean;
}

export type Block = InputBlock | RadioBlock | ButtonBlock;

export interface SubStep {
  name: string;
  blocks: Block[];
  description?: string;
  canAskAI?: boolean;
}

export interface Step {
  substeps: SubStep[];
}

export interface StepsContextType {
  steps: Step[];
  currentStepIndex: number;
  currentSubStepIndex: number;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number, subStepIndex?: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  totalSteps: number;
  totalSubSteps: number;
}
