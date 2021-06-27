const express = require("express");
const router = express.Router();
const Contact = require("../moffen");

const {
    valitionCreateContact,
    valitionUpdapeContact,
    valitionUpdapeStatusContact,
} = require("./valition");

router.get("/", async (req, res, next) => {
    try {
        const contact = await Contact.listContact();
        return res.json({ status: "success", code: 200, data: {contact} });
    } catch (error) {
        next(error);
    }
});

router.get("/:contactId", async (req, res, next) => {
    try {
        const contact = await Contact.getContactById(req.params.contactId);

        if (contact) {
            return res
            .status(200)
            .json({ status: "success", code: 200, data: { contact } });
        }

        return res.json({ status: "error", code: 404, message: "Not found" });
    } catch (error) {
        next(error);
    }
});

router.post("/", valitionCreateContact, async (req, res, next) => {
    try {
        const contact = await Contact.addContact(req.body);

        return res
        .status(201)
        .json({ status: "success", code: 201, data: { contact } });
    } catch (error) {
        next(error);
    }
});

router.delete("/:contactId", async (req, res, next) => {
    try {
        const contact = await Contact.removeContact(req.params.contactId);

        if (contact) {
            return res.status(200).json({
                status: "success",
                code: 200,
                data: { contact },
                message: "Contact deleted",
            });
        }

        return res.json({ status: "error", code: 404, message: "Not found" });
    } catch (error) {
        next(error);
    }
});

router.put("/:contactId", valitionUpdapeContact, async (req, res, next) => {
    try {
        const contact = await Contact.updapeContact(req.params.contactId, req.body);

        if (contact) {
            return res.status(200).json({
                status: "success",
                code: 200,
                data: { contact },
            });
        }

        return res.json({ status: "error", code: 404, message: "Not found" });
    } catch (error) {
        next(error);
    }
});

router.patch("/:contactId/favorite", valitionUpdapeStatusContact, async (req, res, next) => {
    try {
        const contact = await Contact.updapeContact(req.params.contactId, req.body);

        if (contact) {
            return res.status(200).json({
                status: "success",
                code: 200,
                data: { contact },
            });
        }

        return res.json({ status: "error", code: 404, message: "Not found" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;