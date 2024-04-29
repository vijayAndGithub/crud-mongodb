const express = require("express");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
