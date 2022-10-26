const ProductController = require("../controllers/productController");
const authorization = require("../middlewares/adminAuthorization");
const authentication = require("../middlewares/authentication");
const router = require("express").Router();

router.use(authentication);

router.get("/products", ProductController.getAll);

router.use("/products", authorization);

router.post("/products", ProductController.create);
router.put("/products/:id", ProductController.update);
router.patch("/products/:id", ProductController.patchUpdate);
router.delete("/products/:id", ProductController.delete);

module.exports = router;