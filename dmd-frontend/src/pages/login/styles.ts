import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


import styled from 'styled-components';

export const LoginFormTitle = styled(Typography)`
    padding: 20px 0;
`;

export const StyledPaper = styled(Paper)`
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const FlexContainer = styled(Container)`
    display: flex;
    height: 90vh;
`;


export const StyledTextField = styled(TextField)`
    margin-bottom: 20px;
`;

export const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
`;
