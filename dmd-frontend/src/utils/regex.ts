/*
 *  Must contains:
 *    - from 8 to 32 characters
 *    - at least 1 Uppercase character
 *    - at least 1 lowercase character
 *    - at least 1 numberic character
 *    - at least 1 special character
 * */
const passwordReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]|[_]).{8,32}$/;
const usernameReg = /^([A-Za-z0-9._]){6,16}$/;

export const checkPassword = (password: string) => {
    return passwordReg.test(password); 
};

export const checkUsername = (username: string) => {
    return usernameReg.test(username);
};
