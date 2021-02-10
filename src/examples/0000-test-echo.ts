import { DenoteUserIdentity } from 'denote-ui';
import { DenoteRequest } from 'denote-request';

(async () => {
  const user = DenoteUserIdentity.fromMnemonic(
    'jump dirt foam license journey imitate forum orient hard miracle task castle',
  );

  const dr = DenoteRequest.init(user);

  const res = await dr.request({
    method: 'GET',
    url: 'http://localhost:1337/v1/echo',
  });

  console.log(res.data);
})();
