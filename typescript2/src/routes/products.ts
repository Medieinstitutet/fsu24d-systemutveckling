import express from "express";

let router = express.Router();

router.get("/all", (req, res) => {

    res.send([]);
});

export default router;