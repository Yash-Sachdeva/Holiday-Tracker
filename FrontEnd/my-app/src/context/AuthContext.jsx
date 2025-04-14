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
      const adminResponse = await fetch('http://localhost:8080/admin/session', {
        credentials: 'include'
      });
      const adminData = await adminResponse.text();
      
      if (adminData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('ADMIN');
        setIsLoading(false);
        return;
      }
      const hrResponse = await fetch('http://localhost:8080/hr/session', {
        credentials: 'include'
      });
      const hrData = await hrResponse.text();

      if (hrData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('HR');
        setIsLoading(false);
        return;
      }

      const employeeResponse = await fetch('http://localhost:8080/employee/session', {
        credentials: 'include'
      });
      const employeeData = await employeeResponse.text();
      
      if (employeeData.includes('User is logged in')) {
        setIsAuthenticated(true);
        setUserRole('EMPLOYEE');
        setIsLoading(false);
        return;
      }
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
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Logout failed:', errorText);
      }
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

