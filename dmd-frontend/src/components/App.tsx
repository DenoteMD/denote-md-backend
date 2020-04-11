import React, { Component } from 'react';

import { Theme } from '@material-ui/core';
import {
  MuiThemeProvider,
  createMuiTheme,
  createStyles,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';

import Topbar from './Topbar';
import Editor from './Editor';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
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
  });

class App extends Component<WithStyles<typeof styles>> {
  onEditorSave = (content: string) => {
    console.log(content);
  };

  render() {
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Topbar />
        <Container className={classes.container}>
          <Editor className={classes.editor}></Editor>
          <div className={classes.sidebar}></div>
        </Container>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
