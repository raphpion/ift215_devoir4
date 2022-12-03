/** Gestionnaire de la session utilisateur dans l'application client Pro-Gramme. */
class SessionManager {
  /**
   * Détermine la session courante du client dans le LocalStorage.
   *
   * @param {number} idClient L'id du client présentement connecté.
   * @param {string} token Token JWT qui sera enregistré dans le LocalStorage.
   * @param {string} role Rôle du client.
   */
  static setSession(idClient, token, role) {
    localStorage.setItem('pro-gramme__session', JSON.stringify({ idClient, token, role }));
  }

  /**
   * Retire la session courante du client dans le LocalStorage. **Cette fonction ne déconnecte pas le client du serveur !**
   */
  static clearSession() {
    localStorage.removeItem('pro-gramme__session');
  }

  /**
   * Récupère, valide et retourne la session courante du client dans le LocalStorage.
   *
   * @returns {{ idClient: number, token: string, role: string } | false} La session validée, ou `false` si elle est invalide.
   */
  static getSession() {
    const sessionJSON = localStorage.getItem('pro-gramme__session');
    if (sessionJSON === null) return false;

    const session = JSON.parse(sessionJSON);
    if (session.idClient === undefined || session.token === undefined || session.role === undefined) return false;
    if (typeof session.token !== 'string' || typeof session.role !== 'string') return false;

    session.idClient = parseInt(session.idClient);
    if (isNaN(session.idClient)) return false;

    return session;
  }
}
