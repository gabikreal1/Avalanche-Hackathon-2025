export enum BlockType {
  INPUT = 'input',
  RADIO = 'radio'
}

export interface InputBlock {
  type: BlockType.INPUT;
  heading: string;
  placeholder: string;
}

export interface RadioBlock {
  type: BlockType.RADIO;
  options: string[];
}

export type Block = InputBlock | RadioBlock;

export interface SubStep {
  name: string;
  blocks: Block[];
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
