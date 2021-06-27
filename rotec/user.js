const express = require("express");
const router = express.Router();
const controle = require("../contronec/users");
const guard = require("../../../helpers/guard");

router.post("/signup", controle.signup);

router.post("/login", controle.login);

router.post("/logout", guard, controle.logout);

router.get("/current", guard, controle.currentUser);

router.patch("/subscription", guard, controle.update);

module.exports = router;