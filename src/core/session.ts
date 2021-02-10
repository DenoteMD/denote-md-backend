import { IDocumentSession } from '../model/session';
import { IDocumentUser } from '../model/user';

export class DenoteSession {
  private sessionData: Map<string, any>;

  constructor(sessionDocument: IDocumentSession) {
    this.sessionData = new Map<string, any>();
    // Session data block
    this.sessionData.set('session-data', sessionDocument);
    this.sessionData.set('user-data', sessionDocument.user);
  }

  /**
   * Makre sure user authenticated and there are no data mismatch
   * @return {*}
   * @memberof DenoteSession
   */
  public isAuthenticated() {
    if (this.sessionData.get('user-data') && this.sessionData.get('session-data')) {
      return true;
    }
    return false;
  }

  /**
   * Get session data
   * @return {*}  {ISession}
   * @memberof DenoteSession
   */
  public getSession(): IDocumentSession {
    return this.sessionData.get('session-data');
  }

  /**
   * Get user of this session
   * @return {*}  {IUser}
   * @memberof DenoteSession
   */
  public getUser(): IDocumentUser {
    return this.sessionData.get('user-data');
  }
}

export default DenoteSession;
