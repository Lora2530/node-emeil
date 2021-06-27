const express = require("express");
const router = express.Router();
const users = require("../contronec/users");
const guard = require("../help/guard");
const upget = require("../help/upget");

outer.post("/signup", users.signup);

router.post("/login", users.login);

router.post("/logout", guard, users.logout);

router.get("/current", guard, users.currentUser);

router.patch("/subscription", guard, users.upget);

router.patch("/avatars", guard, upget.single("avatar"), controller.avatars);

router.get("/verify/:token", users.verify);
router.post("/verify", users.repeatEmailVerification);

module.exports = router;