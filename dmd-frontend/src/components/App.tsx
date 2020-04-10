import React, { Component } from 'react';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';

import Topbar from './Topbar';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

class App extends Component<{}> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Container>
          <Topbar />
        </Container>
      </MuiThemeProvider>
    );
  }
}

export default App;
