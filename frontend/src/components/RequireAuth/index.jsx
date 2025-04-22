import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";

//Outlet: represent every children of RequireAuth, RequireAuth component will protect
//every child component nested inside of it.

export const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth(); // Custom hook to get authentication data (auth object)
  const location = useLocation(); // Hook to get the current location (URL)

  // Check if auth exists and if the user's role is in allowedRoles
  // without destructuring: const role = auth ? auth.role : undefined; This checks if auth is defined before accessing the role property.
  //  If auth is not defined, role will be assigned undefined.
  const { role } = auth || {}; // Safe access
  // Check if auth exists and if the user's role is in allowedRoles
  const found = role && allowedRoles.includes(role);

  // Log the auth value whenever it changes
  useEffect(() => {
    console.log("RequireAuth auth state:", "auth", auth);
  }, [auth]);

  return auth ? (
    found ? (
      // If user is authenticated and has the correct role, render the Outlet
      <Outlet />
    ) : (
      // If user is authenticated but doesn't have the proper role, redirect to unauthorized with replace user can go back to where we were
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    )
  ) : (
    // If the user is not authenticated, redirect to signin
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};
