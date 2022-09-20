import { Box } from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";
import Fab from "@material-ui/core/Fab";
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import ChatIcon from "@material-ui/icons/Chat";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import { Widget } from "./components/widget";

const theme = createTheme({
  palette: {
    primary: {
      ...blue,
      main: "#00a4e8",
      700: "#008fd2",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  fab: {
    color: "white",
    borderColor: theme.palette.primary.main,
    outlineColor: theme.palette.primary.main,
  },
}));

function App() {
  const [widgetOpen, setWidgetOpen] = useState(true);
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.container}>
        {widgetOpen && <Widget />}
        <Fab
          color="primary"
          aria-label="ChatBot öffnen"
          onClick={() => setWidgetOpen((open) => !open)}
          className={classes.fab}
          focusVisibleClassName={classes.fab}
        >
          {widgetOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Box>
    </ThemeProvider>
  );
}

export default App;
