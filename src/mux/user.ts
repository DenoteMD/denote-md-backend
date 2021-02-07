import { IRequestData, Mux, IResponseRecord } from '../framework';
import { EmailValidator } from '../validators';
import { ModelUser, IUser } from '../model/user';

Mux.post<IUser>(
  '/v1/user/sign-in',
  EmailValidator,
  async (requestData: IRequestData): Promise<IResponseRecord<IUser>> => {
    const { email } = requestData.body;
    const user = await ModelUser.findOne({ email });
    if (user) {
      // User is already existed
    } else {
      // User wasn't exist send an email to user
      // Allow user to register with given email
    }
    throw new Error("Unexpected error we don't know this state");
  },
);
