// Middleware to check whether the authenticated user has the required role (user or host).
module.exports = authorizeRole = (roles) => {
  return (req, res, next) => {
    console.log(req.auth.role, "Middleware authorizeRole", roles);
    if (!req.auth || !req.auth.role) {
      // check if req.auth exist, or doesn't have a role or return undefined.
      return res
        .status(401)
        .json({ message: "User not authenticated or role missing" });
    }
    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
