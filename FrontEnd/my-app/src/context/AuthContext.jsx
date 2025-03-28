import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // First try employee session
      const employeeResponse = await fetch('http://localhost:8080/auth/session/employee', {
        credentials: 'include'
      });
      const employeeData = await employeeResponse.text();
      
      if (employeeData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('EMPLOYEE');
        setIsLoading(false);
        return;
      }

      // If not employee, try HR session
      const hrResponse = await fetch('http://localhost:8080/auth/session/hr', {
        credentials: 'include'
      });
      const hrData = await hrResponse.text();

      if (hrData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('HR');
        setIsLoading(false);
        return;
      }

      // If neither, user is not authenticated
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      console.error('Session check error:', error);
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = async () => {
    try {
      const endpoint = userRole === 'HR' 
        ? 'http://localhost:8080/auth/logout/hr'
        : 'http://localhost:8080/auth/logout/employee';

      await fetch(endpoint, {
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    userRole,
    login,
    logout,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

