import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {
    checkPassword,
    checkUsername,
} from '../../utils/regex';

const Login: React.FC<any> = (props: any) => {

    const { handleSubmit, register, errors, setValue } = useForm<{
        username: string,
        password: string,
    }>({
        defaultValues: {
            username: '',
            password: '',
        }
    });

    const _handleFormSubmit = useCallback((data, e) => {
        e.preventDefault();
        console.log(data);
    }, []);

    const _handleUsernameChange = useCallback((e) => {
        setValue('username', e.target.value);
    }, [setValue]);

    const _handlePasswordChange = useCallback((e) => {
        setValue('password', e.target.value);
    }, [setValue]);

    useEffect(() => {
        register('username', {
            validate: (value) => {
                if (value.length === 0) return 'Username cannot be empty';
                return checkUsername(value) || 'Invalid username format';
            }
        });
        register('password', {
            validate: (value: string) => {
                if (value.length === 0) return 'Password cannot be empty';
                if (value.length < 8 || value.length > 32) return 'Password must be between 8 and 32 characters';
                return checkPassword(value) || 'Invalid password, please have a look at our password policy';
            }
        });
    }, [register]);

    return (
        <FlexContainer
            maxWidth="md"
        >
            <Grid
                container
                justify="center"
                alignItems="center"
            >
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                >
                    <StyledPaper
                        elevation={3}
                    >
                        <Grid
                            container
                            direction="column"
                        >
                            <Grid
                                item
                            >
                                <LoginFormTitle variant="h3">LOGIN</LoginFormTitle>
                            </Grid>
                            <Grid item>
                             <StyledForm onSubmit={handleSubmit(_handleFormSubmit)}>
                                 <StyledTextField
                                     name="username"
                                     label="Username"
                                     ref={register}
                                     error={Boolean(errors?.username)}
                                     onChange={_handleUsernameChange}
                                     helperText={errors?.username?.message}
                                 /> 
                                 <StyledTextField
                                     name="password"
                                     type="password"
                                     label="Password"
                                     ref={register}
                                     error={Boolean(errors?.password)}
                                     onChange={_handlePasswordChange}
                                     helperText={errors?.password?.message}
                                 />
                                 <Button
                                     type="submit"
                                     color="primary"
                                     variant="contained"
                                 >
                                     Login
                                 </Button>
                             </StyledForm>
                            </Grid>
                       </Grid>
                    </StyledPaper>
                </Grid>
            </Grid>
         </FlexContainer>
    );
};

const LoginFormTitle = styled(Typography)`
    padding: 20px 0;
`;

const StyledPaper = styled(Paper)`
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FlexContainer = styled(Container)`
    display: flex;
    height: 90vh;
`;


const StyledTextField = styled(TextField)`
    margin-bottom: 20px;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
`;

export default Login;

