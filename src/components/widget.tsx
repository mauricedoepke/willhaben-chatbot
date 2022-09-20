import { Avatar, Card, CardContent, CardHeader } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useMessageFlow } from "../flow-logic";
import { Message } from "./message";

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
    color: "white",
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
        avatar={<Avatar aria-label="Willhaben Bot avatar">WB</Avatar>}
        title="Willhaben Bot"
      />
      <CardContent className={classes.messageArea}>
        {messages.map((message, i) => (
          <Message
            key={i}
            {...message}
            onAnswerButtonClick={answerMessageQuestion}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export { Widget };
