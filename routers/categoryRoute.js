const CategoryController = require("../controllers/categoryController");
const authorization = require("../middlewares/adminAuthorization");
const authentication = require("../middlewares/authentication");
const router = require("express").Router();

router.use(authentication);
router.get("/categories", CategoryController.getAll);

router.use("/categories", authorization);

router.post("/categories", CategoryController.create);
router.patch("/categories/:id", CategoryController.update);
router.delete("/categories/:id", CategoryController.delete);

module.exports = router;