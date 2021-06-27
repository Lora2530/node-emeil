const fs = require("fs/promises");
const path = require("path");
const jwt = require("jsonwebtoken");

const User = require("../repocihot/users");
const { HttpCode } = require("../help/const");
const EmailService = require("../servies/email");
const { CreteEmailSentikSeteder } = require("../servies/email-sentik");

require("dotenv").config();
const UplotAvatarService = require("../servies/local-uplot");

const SECRET_KEY = process.env.SECRET_KEY;
const sigup = async (req, res, next) => {
    try {
        const user = await User.findByEmail(req.body.email);

        if (user) {
            return res.status(HttpCode.CONFLICT).json({
                status: "error",
                code: HttpCode.CONFLICT,
                message: "Email in use",
            });
        }
        const { id, email, subscription, avatar, verifyToken } =
          await Users.createUser(req.body);

        try {
            const emailService = new EmailService(
                process.env.NODE_ENV,
                new CreteEmailSentikSeteder()
            );
            await emailService.sendVerifyEmail(verifyToken, email);
        } catch (error) {
            console.log(error.message);
        }

        return res.status(HttpCode.CREATED).json({
            status: "success",
            code: HttpCode.CREATED,
            data: { id, email, subscription, avatar },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await User.findByEmail(req.body.email);
        const isValidPassword = await user?.isValidPassword(req.body.password);

        if (!user || !isValidPassword || !user.verify) {
            return res.status(HttpCode.UNAUTHORIZED).json({
              status: "error",
              code: HttpCode.UNAUTHORIZED,
              message: "Email or password is wrong",
            });
        }
        const id = user.id;
        const payload = { id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

        await Users.updateToken(id, token);

        return res.json({ status: "success", code: HttpCode.OK, data: { token } });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const id = req.user.id;

        await User.updateToken(id, null);
        return res.status(HttpCode.NO_CONTENT).json();
    } catch (error) {
        next(error);
    }
};

const currentUser = async (req, res, next) => {
    try {
        const { email, subscription } = req.user;

        return res.status(HttpCode.OK).json({
            status: "success",
            code: HttpCode.OK,
            data: { email, subscription },
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const id = req.user.id;
        if (req.body) {
            const user = await Users.updateUserSubscription(id, req.body);
            const { email, subscription } = user;

            if (user) {
                return res.status(HttpCode.OK).json({
                    status: "success",
                    code: HttpCode.OK,
                    data: { email, subscription },
                });
            }
            return res.json({
                status: "er",
                code: 404, message: "Not Found"
            });
        }
    }catch (error) {
        next(error);
    }
};

  
const avatars = async (req, res, next) => {
    try {
      const id = req.user.id;
      const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
  
      const avatarURL = await uploads.saveAvatar({ idUser: id, file: req.file });
     try {
        await fs.unlink(path.join(process.env.AVATAR_OF_USERS, req.user.avatar));
      } catch (error) {
        console.log(error.message);
      }
  
      await Users.updateAvatar(id, avatarURL);
  
      res.json({
        status: "success",
        code: HttpCode.OK,
        data: { avatarURL },
      });
    } catch (error) {
      next(error);
    }
};
  
const verify = async (req, res, next) => {
    try {
      const user = await Users.findByVerifyToken(req.params.token);
  
      if (user) {
        await Users.updateTokenVerify(user.id, true, null);
        return res.json({
          status: "success",
          code: HttpCode.OK,
          message: "Verification successful",
        });
      }
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        message: "User not Found",
      });
    } catch (error) {
      next(error);
    }
};
  
const repeatEmailVerification = async (req, res, next) => {
    try {
      const user = await Users.findByEmail(req.body.email);
  
      if (user) {
        const { email, verify, verifyToken } = user;
  
        if (!verify) {
          const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateEmailSenderSendgrid()
          );
  
          await emailService.sendVerifyEmail(verifyToken, email);
          return res.json({
            status: "success",
            code: HttpCode.OK,
            data: { message: "Verification email sent" },
          });
        }
  
        return res.status(HttpCode.CONFLICT).json({
          status: "error",
          code: HttpCode.CONFLICT,
          message: "Email has been verified",
        });
      }
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        code: HttpCode.BAD_REQUEST,
        message: "Verification has already been passed",
      });
    } catch (error) {
      next(error);
    }
};
  
module.exports = {
    signup,
    login,
    logout,
    currentUser,
    update,
    avatars,
    verify,
    repeatEmailVerification,
};