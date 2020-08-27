import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const Login: React.FC<any> = (props: any) => {
    const { handleSubmit, register, errors, setValue } = useForm<{
        email: string,
    }>({
        defaultValues: {
            email: '',
        }
    });

    const _handleFormSubmit = useCallback((values) => {
        console.log(values);
    }, []);

    const _handleEmailChange = useCallback((e, email) => {
        setValue('email', email);
    }, []);

    useEffect(() => {
        register('email', {
            validate: (value) => {
                if (value.length === 0) return 'Email cannot be empty';
               return emailReg.test(value) || 'Invalid email format';
            }
        });
    }, [register]);

    return (
        <FlexContainer maxWidth="md">
            <Grid container>
                <Grid item>
                    <form onSubmit={_handleFormSubmit}>
                        <TextField
                            name="email"
                            error={errors?.email}
                            helperText={errors?.email?.message}
                            onChange={_handleEmailChange}
                        /> 
                    </form>
                </Grid>
            </Grid>
        </FlexContainer>
    );
};

const FlexContainer = styled(Container)`
    display: flex;
`;

export default Login;

