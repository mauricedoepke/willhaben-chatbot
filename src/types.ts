export interface MessageFlowElement {
  id: number;
  name: string;
  text: string;
  valueOptions: {
    nextId: number | boolean;
    value: boolean | number | string;
    text: string;
  }[];
}

export interface Message {
  templateId?: number;
  sender: "bot" | "user";
  text: string;
  buttons?: { text: string; value: string | number | boolean }[];
}

export type UserAnswers = {
  name: string;
  value: string | number | boolean;
}[];
