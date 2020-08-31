import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextArea from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    marginTop: '10px',
  },
  label: {},
  textArea: {
    marginTop: '10px',
    marginBottom: '10px',
    minWidth: '100%',
    maxwidth: '100%',
    fontSize: '14px',
    padding: '10px',
    fontFamily: 'Consolas,Courier,serif',
    lineHeight: '21px;',
    boxSizing: 'border-box',
  },
  gridContainer: {
    marginTop: '20px',
  }
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
            <Grid item sm={6} xs={12}>
              <TextField id="title" label="Title" fullWidth/>
            </Grid>
          </Grid>          
        </div>
        <div>       
          <Grid container spacing={2} className={classes.gridContainer}> 
            <Grid item sm={6} xs={12} zeroMinWidth>
              <Typography className={classes.label} variant="h6" noWrap>
                New paste
              </Typography>
              <TextArea value={text}
                      onChange={handleOnChange}
                      className={classes.textArea}
                      rowsMin="15"
              ></TextArea>
            </Grid>
            <Grid item sm={6} xs={12} zeroMinWidth>   
              <Typography className={classes.label} variant="h6" noWrap>
                Static content
              </Typography>
              <Box>
                {text}
              </Box>
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