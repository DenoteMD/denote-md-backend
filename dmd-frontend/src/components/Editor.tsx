import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextArea from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useForm } from 'react-hook-form';

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
  },
  msgRequire:{
    color: "red"
  }
}));

interface comProps {
  className: string;
  onSaveFunc: (title: string, content: string) => void;
}

const Editor = ({ className, onSaveFunc }: comProps) => {
  const classes = useStyles();

  const [titleValue, setTitleValue] = React.useState('');
  const [contentValue, setContentValue] = React.useState('');
  const { handleSubmit, register, errors} = useForm();
  const xss = require("xss");

  const onFormSubmit = React.useCallback((data, e) => {
    e.preventDefault();
    onSaveFunc(xss(data.title), xss(data.content));
    setTitleValue('');
    setContentValue('');
  }, []);

  const handleChangeTileValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitleValue(e.currentTarget.value);
  };

  const handleChangeContentValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentValue(e.currentTarget.value);
  };
  
  const showMessageError = (_fieldName: string) => {
    let error = (errors as any)[_fieldName];
    return error ? (
      <div className={classes.msgRequire}>
        <Box component="label">
          {error.message || "Field is required"}
        </Box>
      </div>
    ) : null;
  };

  return (
    <div className={`${classes.wrapper} ${className}`}>
      <form className="" onSubmit={handleSubmit(onFormSubmit)}>
        <div>
          <Grid container spacing={2}> 
            <Grid item sm={6} xs={12}>
              <TextField id="title"
                         name="title"
                         label="Title"
                         fullWidth
                         value={titleValue}
                         onChange={handleChangeTileValue}
                         inputRef={register({
                          required: "Required",
                          minLength: {
                            value: 1,
                            message: "Must be enter from 1 to 256 characters"
                          },
                          maxLength: {
                            value: 256,
                            message: "Must be enter from 1 to 256 characters"
                          }
                        })}/>
                {showMessageError("title")}
            </Grid>
          </Grid>          
        </div>
        <div>       
          <Grid container spacing={2} className={classes.gridContainer}> 
            <Grid item sm={6} xs={12} zeroMinWidth>
              <Typography className={classes.label} variant="h6" noWrap>
                New paste
              </Typography>
              <TextArea id="content"
                        name= "content"
                        value={contentValue}
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