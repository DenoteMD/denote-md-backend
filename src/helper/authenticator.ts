import crypto from 'crypto';
import { DenoteUserIdentity } from 'denote-ui';
import { Buffer } from 'safe-buffer';

export class Authenticator {
  public static generateChallege() {
    return crypto.randomBytes(32).toString('hex');
  }

  public static verifyChallengeProof(singedProof: string): string {
    return DenoteUserIdentity.recoverUserID(Buffer.from(singedProof, 'hex'));
  }
}

export default Authenticator;
