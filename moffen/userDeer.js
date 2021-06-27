const Joi = require("joi");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const Jimp = require("jimp");
const { isValidObjectId } = require("mongoose");
const User = require("./user");
const SECRET_KEY = process.env.SECRET_KEY;
const AVATAR_OF_USER = process.env.AVATAR_OF_USER;

const valiteId = (req, res, next) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).send("Inalid id");
    }

    next();
};

const authValition = (req, res, next) => {
    const validationRules = Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: false} })
            .required(),
        password: Joi.string().required(),
    });

    const valitionResult = valitionRules.valite(req.body);
    if (valitionResult.error) {
        return res.status(400).send(valitionResult.error);
    }

    next();
};

const autorizete = async (req, res, next) => {
    try {
        const autorizeteHeader = req.get("Autorizete");
        if (!autorizeteHeader) {
            return res.status(401).json("Not autorizete");
        }

        const token = autorizeteHeader.replace("Bearer", "");
        const userId = await jwt.verify(token, SECRET_KEY).id;
        if (!userId) {
            return res.status(401).json("Not autorizete");
        }

        const user = await User.findById(userId);
        if (!user || user.token !== token) {
            return res.status(401).json("Not autorizete");
        }
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        next(err);
    }
};

const updateAvatars = async (req, res, next) => {
    try {
        if (req.file) {
            const { file } = req;
            const img = await Jimp.read(file.path);
            await img
                .autocrop()
                .cover(
                    250, 250,
                    Jimp.HORIZONTAL_ALIGN_CENTER,
                    Jimp.VERTICAL_ALIGN_MIDDLE
                )
                .writeAsync(file.path);
            await fs.rename(file.path, path.join(AVATAR_OF_USER, file.originame));
        }
        const { _id: userId } = req.user;
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {$set: req.body},
            {new: true}
        );

        return res.status(200).json({avatarURL: updatedUser});
    } catch (err) {
      next(err);
    }
};
const sigUp = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        return res
         .status(400)
         .json({ status: "error", code: 200, message: "Email in used" });
    }
    try {
        const createUser = async (body) => {
            const user = new User (body);
            return await user.save();
        };
        const data = await createUser({
            ...req.body,
        });

        return res.status(201).json({
            ststus: "success",
            code: 201,
            user: {data},
        });
    } catch (e) {
        next (e);
    }
};
const sigIp = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        const isValidPassword = await user?.isValidPassword(req.body.password);
        if (!user || !isValidPassword) {
            return res.status(401).json({
              status: 'error',
              code: 401,
              message: 'Email or password is wrong',
        });
    }
    const id = user.id;
    const payload = { id, user: "User" };

    const token = await jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    const updatedUser = await User.findByIdAndUpdate(
        user._id, { token }, {new: true}
    );
    return res.status(200).json({
        user: { updateUser },
    });
    } catch (e) { 
    next (e);
    };
};

const logout = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndUpdate(userId, { token: null, });
        return res.status(204).send("No content");
    } catch (e) { 
        next (e)
    };
};

const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const currentUser = await User.findById(userId);

        return res.status(200).json(currentUser);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    singUp, updateAvatars, singIn, logout, getCurrentUser,
    valiteId, authorize, authValition,
};