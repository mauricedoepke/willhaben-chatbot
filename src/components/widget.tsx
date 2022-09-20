import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import messageFlow from "../assets/flow.json";
import { Message } from "./message";
import { Dictionary, isNumber, keyBy } from "lodash";
import { useMemo, useState } from "react";
import { Message as IMessage, MessageFlowElement } from "../types";

const initialMessageId = 100;
const messageFlowMap: Dictionary<MessageFlowElement> = keyBy(
  messageFlow,
  ({ id }) => id
);
const flowElementToMessage = (flowElement: MessageFlowElement) => ({
  templateId: flowElement.id,
  sender: "bot" as const,
  text: flowElement.text,
  buttons: flowElement.valueOptions.map(({ text, value }) => ({ text, value })),
});
const getNextMessage = (nextId: number | boolean) => {
  if (isNumber(nextId)) return flowElementToMessage(messageFlowMap[nextId]);
  return { sender: "bot" as const, text: "Herzlichen Dank für Ihre Angaben" };
};
const useMessageFlow = () => {
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
        ...messageHistory,
        {
          sender: "bot",
          text: "Da ist leider etwas schief gelaufe, bitte Kontaktiere unseren Support",
        },
      ]);
      return;
    }

    setMessageHistory([
      ...messageHistory.map(({ buttons, ...rest }) => ({ ...rest })),
      { sender: "user", text: chosenAnswer.text },
      getNextMessage(chosenAnswer.nextId),
    ]);
  };

  return {
    messages: messageHistory,
    answerMessageQuestion,
  };
};

const useStyles = makeStyles((theme) => ({
  widget: {
    width: 350,
    height: 600,
    marginBottom: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: theme.palette.primary.main,
  },
  messageArea: {
    flexGrow: 1,
    background: theme.palette.grey[100],
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    overflowY: "auto",
  },
}));

const Widget = () => {
  const classes = useStyles();
  const { messages, answerMessageQuestion } = useMessageFlow();

  return (
    <Card className={classes.widget} elevation={5}>
      <CardHeader
        className={classes.header}
        avatar={<Avatar aria-label="recipe">WB</Avatar>}
        title="Willhaben Bot"
      />
      <CardContent className={classes.messageArea}>
        {messages.map((message) => (
          <Message {...message} onAnswerButtonClick={answerMessageQuestion} />
        ))}
      </CardContent>
    </Card>
  );
};

export { Widget };
