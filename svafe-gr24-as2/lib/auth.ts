export interface UserInfo {
  userId?: number;
  email?: string;
  accountType?: string;
  exp?: number;
  [key: string]: any;
}

export function decodeJWT(token: string): UserInfo | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getAccountType(userInfo: UserInfo | null): string | undefined {
  if (!userInfo) return undefined;
  
  return (
    userInfo.accountType ||
    userInfo.AccountType ||
    userInfo.role ||
    userInfo.Role ||
    userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    userInfo['role'] ||
    undefined
  );
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    return null;
  }
  return token;
}

export function getStoredUserInfo(): UserInfo | null {
  const token = getStoredToken();
  if (!token) return null;
  return decodeJWT(token);
}

