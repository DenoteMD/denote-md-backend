import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextArea from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
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
  })
);

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

  return (
    <div className={`${classes.wrapper} ${className}`}>
      <form className="" onSubmit={onFormSubmit}>
        <div>
          <Typography className={classes.label} variant="h6" noWrap>
            Paste your text here
          </Typography>
          <TextArea
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setText(e.currentTarget.value);
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
};

export default Editor;
