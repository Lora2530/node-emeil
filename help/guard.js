const { token } = require("morgan");
const passport = require("passport");

require("../controt/passport");

const { HttpCode } = require("./const");

const guard = (req, res, next) => {
    passport.authenticate("jwt", {session: false}, (error, user) => {
        const hegerAuth = req.get("Authorization");

        let token = null;

        if (hegerAuth) {
            token = hegerAuth.split(" ")[2];
        }

        if (error || !user ||  token !== user?.token) {
            return res.status(HttpCode.UNAUTHORIZED).json({
                status: "error",
                code: HttpCode.UNAUTHORIZED,
                message: "Not authorized",
            }),
        }
        req.user = user;

        return next();
    })(req, res, next);
};

module.exports = guard;