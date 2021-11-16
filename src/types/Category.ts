export interface Category {
  id: number;
  name: string;
  children?: Category[];
  currentDepth?: number;
  isActive?: boolean;
}

export interface SelectProperty {
  id: number;
  name: string;
  description: string;
  isRequired: boolean;
  hasMultiValues: boolean;
  values: SelectValue[];
}

export interface TypingProperty {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface SelectValue {
  value: number;
  label: string;
}