const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
    "/customer",
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    //Write the authenication mechanism here
    // Check if the token is valid and present in the request headers
    if (req.session.authorization) {
        const { token } = req.session.authorization;
        jwt.verify(token, "verySecretString", (err) => {
            // If the token is valid, call the next middleware or function
            if (!err) {
                next();
            } else {
                res.status(403).json({ message: "Forbidden" });
            }
        });
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
