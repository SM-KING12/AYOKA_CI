import { useAuth } from '../contexts/AuthContext';

export function useTravelerAuth() {
  const { user, isAuthenticated, login, register, logout, hasRole } = useAuth();

  const isTraveler = hasRole('traveler');

  const loginAsTraveler = async (email: string, password: string) => {
    await login(email, password);
  };

  const registerAsTraveler = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => {
    await register({
      ...data,
      role: 'traveler',
    });
  };

  return {
    user,
    isAuthenticated,
    isTraveler,
    loginAsTraveler,
    registerAsTraveler,
    logout,
  };
}
