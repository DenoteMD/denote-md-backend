import { ValidationRules } from 'react-hook-form';
import { checkUsername, checkPassword } from '../../utils/regex';

interface IFormRef {
  id: number | string;
  name: 'username' | 'password';
  options: ValidationRules;
};

export const loginFormRefs: IFormRef[] = [{
    id: 1,
    name: 'username',
    options: {
       validate: (value: string) => {
           if (value.length === 0) return 'Username cannot be empty';
           return checkUsername(value) || 'Invalid username format';
       }
    },
  },
  {
      id: 2,
      name: 'password',
      options: {
          validate: (value: string) => {
              if (value.length === 0) return 'Password cannot be empty';
              if (value.length < 8 || value.length > 32) return 'Password must be between 8 and 32 characters';
              return checkPassword(value) || 'Invalid password, please have a look at our password policy';
          }
      },
  },
];
