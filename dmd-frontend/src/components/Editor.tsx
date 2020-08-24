import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import TextArea from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
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
    boxSizing: 'border-box'
  },
  grid: {
    maxWidth: '494px',
    minWidth: '494px'
  },
}));

interface comProps {
  className: string;
  onSaveFunc: (term: string) => void;
}

interface comState {
  text: string;
}

const Editor = ({ className, onSaveFunc }: comProps) => {
  const classes = useStyles();

  const [text, setText] = React.useState('');

  const onFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSaveFunc(text);

    setText('');
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  return (
    <div className={`${classes.wrapper} ${className}`}>
      <form className="" onSubmit={onFormSubmit}>
        <div>       
          <Grid container spacing={2}> 
          <Grid item xs={6} className={classes.grid}>
            <Typography className={classes.label} variant="h6" noWrap>
              New paste
            </Typography>
            <TextField id="title" label="Paste Title"/>
            <TextArea value={text}
                    onChange={handleOnChange}
                    className={classes.textArea}
                    rowsMin="15"
            ></TextArea>
            </Grid>
            <Grid item xs={6} className={classes.grid}>   
              <Typography className={classes.label} variant="h6" noWrap>
                Static content
              </Typography>
              <div>
                {text}
              </div>
            </Grid>
          </Grid>       
        </div>
        <Button variant="contained" type="submit" color="secondary">
          Save
        </Button>
      </form>
    </div>
  );
};

export default Editor;