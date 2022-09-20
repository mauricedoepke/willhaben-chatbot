import messageFlow from "./assets/flow.json";
import { Dictionary, isNumber, keyBy } from "lodash";
import { useMemo, useState } from "react";
import { Message as IMessage, MessageFlowElement, UserAnswers } from "./types";

const initialMessageId = 100;
const messageFlowMap: Dictionary<MessageFlowElement> = keyBy(
  messageFlow,
  ({ id }) => id
);

/**
 *
 * @param flowElement Single entry from the flow.json
 * @returns Formatted Message object that can be displayed in the ui
 */
const flowElementToMessage = (flowElement: MessageFlowElement) => ({
  templateId: flowElement.id,
  sender: "bot" as const,
  text: flowElement.text,
  buttons: flowElement.valueOptions.map(({ text, value }) => ({ text, value })),
});

/**
 * @returns Next formatted message according to the nextId from the users answer
 */
const getNextMessage = (nextId: number | boolean) => {
  if (isNumber(nextId)) return flowElementToMessage(messageFlowMap[nextId]);
  return { sender: "bot" as const, text: "Herzlichen Dank für Ihre Angaben" };
};

/**
 * Used to remove the buttons from older messages,
 * so only the most recent message can be interacted with
 */
const removeButtonsFromMessages = (messages: IMessage[]) => {
  return messages.map(({ buttons, ...rest }) => ({ ...rest }));
};

const sendUserMessagesToServer = async (answers: UserAnswers) => {
  const response = await fetch(
    "https://virtserver.swaggerhub.com/L8475/task/1.0.1/conversation",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    }
  );
  if (!response.ok) throw new Error("could not send answers");
};

/**
 * Handles the whole message flow logic and state.
 * Remembers message history and sends the data to the server
 * once the messsage flow is finished
 */
export const useMessageFlow = () => {
  const [userAnswers, setUserAnswers] = useState<UserAnswers>([]);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([
    flowElementToMessage(messageFlowMap[initialMessageId]),
  ]);
  const currentMessage = useMemo(() => messageHistory.at(-1), [messageHistory]);

  const answerMessageQuestion = (value: string | boolean | number) => {
    const currentFlow = messageFlowMap[currentMessage?.templateId ?? -1];
    const chosenAnswer = currentFlow.valueOptions.find(
      (option) => option.value === value
    );

    if (!chosenAnswer) {
      setMessageHistory([
        ...removeButtonsFromMessages(messageHistory),
        {
          sender: "bot",
          text: "Da ist leider etwas schief gelaufen, bitte Kontaktiere unseren Support",
        },
      ]);
      return;
    }

    setMessageHistory([
      ...removeButtonsFromMessages(messageHistory),
      { sender: "user", text: chosenAnswer.text },
      getNextMessage(chosenAnswer.nextId),
    ]);

    if (chosenAnswer.nextId === false) {
      //last answer is not saved, thus append it manually
      sendUserMessagesToServer([
        ...userAnswers,
        { name: currentFlow.name, value: chosenAnswer.value },
      ]).catch((_) => {
        setMessageHistory([
          ...messageHistory,
          {
            sender: "bot",
            text: "Da ist leider etwas schief gelaufen, bitte Kontaktiere unseren Support",
          },
        ]);
      });
      return;
    }

    setUserAnswers([
      ...userAnswers,
      { name: currentFlow.name, value: chosenAnswer.value },
    ]);
  };

  return {
    messages: messageHistory,
    answerMessageQuestion,
  };
};
