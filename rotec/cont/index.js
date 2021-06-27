const express = require("express");
const router = express.Router();
const controt = require("../controt/contr");
const guard = require("../help/guard");

const {
    valitionCreateContact,
    valitionUpdateContact,
    valitionUpdateStatusContact,
    valitionMongoId,
} = require("./valition");

router.get("/", guard, controller.listContact);
router.get("/:contactId", guard, valitionMongoId, controller.getContactById);

router.post("/", guard, valitionCreateContact, controller.addContact);

router.delete(
  "/:contactId",
  guard,
  valitionMongoId,
  controller.removeContact
);

router.put(
  "/:contactId",
  guard,
  valitionUpdateContact,
  valitionMongoId,
  controller.updateContact
);

router.patch(
  "/:contactId/favorite",
  guard,
  valitionUpdateStatusContact,
  controller.updateContact
);

module.exports = router;
