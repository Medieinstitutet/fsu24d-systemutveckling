import express from "express";
import {login} from "../services/AuthService"

let router = express.Router();

router.get("/login", async(req, res) => {
    
    let isOk = await login(req.body.username, req.body.password, res);

    res.send({"signedIn": isOk});
});

export default router;