import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

/* material-ui components import */
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { 
    loginFormRefs,
} from './constants';

import {
  StyledForm,
  StyledPaper,
  FlexContainer,
  LoginFormTitle,
  StyledTextField,
} from './styles';

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
        loginFormRefs.forEach((ref) => {
            register(ref.name, ref.options);
        });
    }, [register]);

    return (
        <FlexContainer maxWidth="md">
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
                    <StyledPaper elevation={3}>
                        <Grid
                            container
                            direction="column"
                        >
                            <Grid item>
                                <LoginFormTitle variant="h3">LOGIN</LoginFormTitle>
                            </Grid>
                            <Grid item>
                             <StyledForm onSubmit={handleSubmit(_handleFormSubmit)}>
                                 <StyledTextField
                                     name="username"
                                     label="Username"
                                     ref={register}
                                     onChange={_handleUsernameChange}
                                     error={Boolean(errors?.username)}
                                     helperText={errors?.username?.message}
                                 /> 
                                 <StyledTextField
                                     name="password"
                                     type="password"
                                     label="Password"
                                     ref={register}
                                     onChange={_handlePasswordChange}
                                     error={Boolean(errors?.password)}
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


export default Login;

