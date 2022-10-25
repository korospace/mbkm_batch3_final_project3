const transactionAuthorization = require("../middlewares/transactionAuthorization");
const TransactionController = require("../controllers/transactionController");
const adminAuthorization = require("../middlewares/adminAuthorization");
const authentication = require("../middlewares/authentication");
const router = require("express").Router();

router.use(authentication);

router.post("/transactions", TransactionController.create);
router.get("/transactions/user", TransactionController.getAllForUser);

router.use("/transactions/admin", adminAuthorization);

router.get("/transactions/admin", TransactionController.getAllForAdmin);

router.use("/transactions/:transactionId", transactionAuthorization);

router.get("/transactions/:transactionId", TransactionController.getDetail);

module.exports = router;