import { useState, useEffect, createContext, useContext } from "react";
const AuthContext = createContext({});

//Children props represent all the component inside the provider.
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("jwtToken"); //since the auth is not updating due to re-render, means it's undefined. i go around by using the localstorage.
    const role = localStorage.getItem("role"); // You can retrieve other data from localStorage if needed

    if (token) {
      // If token exists, return the initial auth state (with the token)
      return { token, role }; // Add other values as needed, like role, etc.
    }
    return null;
  });
  const logout = () => setAuth(null); //implementation of logout logic

  useEffect(() => {
    console.log("AuthProvider - current auth state:", auth);
  }, [auth]); // Log on each change to `auth`

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// This custom hook allows components to easily access the AuthContext values (user, setAuth, login, logout, and loading).
// Otherwise in each component children we will use this syntaxe:  const {user, login, logout, loading} = useContext(AuthContext)
// instead:  const { user, setAuth, logout, loading } = useAuth();
export const useAuth = () => useContext(AuthContext);
