import React from 'react';

import { Theme } from '@material-ui/core';
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';

import Topbar from './Topbar';
import Login from '../pages/login';
// import Editor from './Editor';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  editor: {
    flexGrow: 1,
    paddingRight: '10px',
  },
  sidebar: {
    width: '250px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const App = () => {
  const classes = useStyles();

  const onEditorSave = (content: string) => {
    console.log(content);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Topbar />
      <Container className={classes.container}>
        <Login />
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
