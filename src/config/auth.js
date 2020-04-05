module.exports = {
  ensureAuthenticate: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash("error_msg", "Please login to view this resource");
      res.redirect("/users/login");
    }
    next();
  },
};
