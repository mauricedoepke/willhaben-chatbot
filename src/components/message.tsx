import { Box, Button, Card } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Message as IMessage } from "../types";

interface ThemeProps {
  isUserMessage: boolean;
}

const useStyles = makeStyles<Theme, ThemeProps>((theme) => ({
  messageContainer: ({ isUserMessage }) => ({
    marginBottom: theme.spacing(2),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: isUserMessage ? "flex-end" : "flex-start",
  }),
  messageCard: ({ isUserMessage }) => ({
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: isUserMessage ? theme.palette.primary.main : undefined,
    color: isUserMessage ? "white" : undefined,
  }),
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: "white",
  },
}));

export interface MessageProps extends IMessage {
  onAnswerButtonClick: (value: string | boolean | number) => void;
}

const Message: React.FC<MessageProps> = ({
  sender,
  text,
  buttons,
  onAnswerButtonClick,
}) => {
  const classes = useStyles({ isUserMessage: sender === "user" });

  return (
    <Box className={classes.messageContainer}>
      <Card className={classes.messageCard} elevation={0}>
        <Box>{text}</Box>
      </Card>
      {buttons && buttons.length > 0 && (
        <Box>
          {buttons.map((button) => (
            <Button
              key={button.value.toString()}
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => onAnswerButtonClick(button.value)}
            >
              {button.text}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export { Message };
