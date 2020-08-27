import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextArea from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import SimpleReactValidator from 'simple-react-validator';

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
  titleValue: string;
  contentValue: string;
}

const Editor = ({ className, onSaveFunc }: comProps) => {
  const classes = useStyles();

  const [titleValue, setTitleValue] = React.useState('');
  const [contentValue, setContentValue] = React.useState('');
  const simpleValidator = React.useRef(new SimpleReactValidator())

  const onFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSaveFunc(contentValue);

    setTitleValue('');
    setContentValue('');
  };

  const handleChangeTileValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(validatorTitleValue.allValid()){
      setTitleValue(e.currentTarget.value);
    }
    else{
      validatorTitleValue.showMessages();
    }
  };

  const handleChangeContentValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentValue(e.currentTarget.value);
  };

  const validatorTitleValue = new SimpleReactValidator({
    className: 'text-danger',
    messages: {},
    validators: {
      ip: {
        message: 'Must be input from 1 to 256 characters',
        rule: function() { 
          if(titleValue.length > 1 && titleValue.length > 256){
            return true;
          }
          return false;
        }
      }
    }
  });

  return (
    <div className={`${classes.wrapper} ${className}`}>
      <form className="" onSubmit={onFormSubmit}>
        <div>
          <Grid container spacing={2}> 
            <Grid item sm={6} xs={12}>
              <TextField id="title"
                         name="title"
                         label="Title"
                         fullWidth
                         value={titleValue}
                         onChange={handleChangeTileValue}/>
              {validatorTitleValue.message}
            </Grid>
          </Grid>          
        </div>
        <div>       
          <Grid container spacing={2} className={classes.gridContainer}> 
            <Grid item sm={6} xs={12} zeroMinWidth>
              <Typography className={classes.label} variant="h6" noWrap>
                New paste
              </Typography>
              <TextArea value={contentValue}
                      onChange={handleChangeContentValue}
                      className={classes.textArea}
                      rowsMin="15"
              ></TextArea>
            </Grid>
            <Grid item sm={6} xs={12} zeroMinWidth>   
              <Typography className={classes.label} variant="h6" noWrap>
                Static content
              </Typography>
              <Box>
                {contentValue}
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