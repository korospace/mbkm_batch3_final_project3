const transactionRoute = require("./routers/transactionRoute");
const categoryRoute = require("./routers/categoryRoute");
const productRoute = require("./routers/productRoute");
const userRoute = require("./routers/userRoute");
const port = process.env.PORT || 4000;
const express = require("express");
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.get('/', (req,res) => {
    res.status(200).json({message:"final project 3 tim 3"})
});

app.use(userRoute);
app.use(categoryRoute);
app.use(productRoute);
app.use(transactionRoute);

app.listen(port,() => {
    console.log(`app listen at port:${port}`);
})
