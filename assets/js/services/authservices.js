export class AuthService {
  constructor() {
    this.sessionKey = 'agri_user_session';
  }

  login(username) {
    const user = { username, loggedInAt: new Date().toISOString() };
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
    console.log(`%c[AuthService] User berhasil login: ${username}`, 'color: #2e7d32; font-weight: bold;');
    return user;
  }

  logout() {
    const user = this.getUser();
    localStorage.removeItem(this.sessionKey);
    console.log(`%c[AuthService] User ${user ? user.username : ''} telah logout.`, 'color: #d32f2f; font-weight: bold;');
  }

  isLoggedIn() {
    const status = localStorage.getItem(this.sessionKey) !== null;
    console.log(`[AuthService] Status login: ${status ? 'Aktif' : 'Tidak'}`);
    return status;
  }

  getUser() {
    const data = localStorage.getItem(this.sessionKey);
    return data ? JSON.parse(data) : null;
  }
}

