import React, { Component } from 'react';

import { Theme } from '@material-ui/core';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import TextArea from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      marginTop: '10px',
    },
    label: {},
    textArea: {
      marginTop: '10px',
      marginBottom: '10px',
      width: '100%',
      fontSize: '14px',
      padding: '10px',
      fontFamily: 'Consolas,Courier,serif',
      lineHeight: '21px;',
      boxSizing: 'border-box',
    },
  });

interface comProps {
  className: string;
  onSaveFunc?: (term: string) => void;
}

interface comState {
  text: string;
}

class Editor extends Component<comProps & WithStyles<typeof styles>, comState> {
  state: comState = {
    text: '',
  };

  onFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(this.state.text);

    this.setState({ text: '' });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={`${classes.wrapper} ${this.props.className}`}>
        <form className="" onSubmit={this.onFormSubmit}>
          <div>
            <Typography className={classes.label} variant="h6" noWrap>
              Paste your text here
            </Typography>
            <TextArea
              value={this.state.text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                this.setState({ text: e.currentTarget.value });
              }}
              className={classes.textArea}
              rowsMin="15"
            ></TextArea>
          </div>
          <Button variant="contained" type="submit" color="secondary">
            Save
          </Button>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(Editor);
