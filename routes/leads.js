var express = require("express");
var router = express.Router();
const leadsController = require("../controllers/leads");

router.post("/", leadsController.createLead);
router.get("/list", leadsController.leadsList);
router.get("/:email", leadsController.getLead);
router.put("/:email", leadsController.editLead);
router.delete("/:email", leadsController.deleteLead);

module.exports = router;
