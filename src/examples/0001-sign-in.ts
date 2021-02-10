import { DenoteUserIdentity } from 'denote-ui';
import { DenoteRequest } from 'denote-request';
import { Buffer } from 'safe-buffer';

(async () => {
  const user = DenoteUserIdentity.fromMnemonic(
    'jump dirt foam license journey imitate forum orient hard miracle task castle',
  );

  const dr = DenoteRequest.init(user);

  const challengeKey = 'c2e86f02c00cc154100ae9a652e4cfa2d9f1087be0ac4aa5205d04ae59803ee8';
  const result = user.sign(Buffer.from(challengeKey, 'hex')).toString('hex');
  console.log('Signed result:', result);

  const res = await dr.request({
    method: 'POST',
    url: 'http://localhost:1337/v1/user/sign-in/verify',
    data: {
      signedChallengeKey: result,
    },
  });

  console.log(res.data);
})();
