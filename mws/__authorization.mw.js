module.exports = ({ meta, config, managers }) => {
  return ({ req, res, next }) => {
    const routeMethod = req.method.toLowerCase();
    const routePath = req.originalUrl;

    // Check if the route method is defined in the authorizedRoutes config
    if (managers.authorizedRoutes[routeMethod]) {
      const authorizedRoutes = managers.authorizedRoutes[routeMethod];

      // Find the route configuration for the current routePath
      const routeConfig = authorizedRoutes.find((route) => route.path === routePath);

      if (routeConfig) {
        const userRole = req.user.userKey.role;

        // Check if the user's role is in the authorizedRoles for the current route
        if (routeConfig.authorizedRoles.includes(userRole)) {
          // User is authorized, proceed to the endpoint
          next();
        } else {
          // User's role is not authorized for this endpoint
          return managers.responseDispatcher.dispatch(res, {
            ok: false,
            code: 403,
            errors: "You're unauthorized to access this resource.",
          });
        }
      } else {
        // No authorization config found for this route
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 404,
          errors: "Route not found.",
        });
      }
    } else {
      // No authorized routes for this method
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 405,
        errors: "Method not allowed.",
      });
    }
  };
};
