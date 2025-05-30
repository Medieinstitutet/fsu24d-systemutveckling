import express from "express";
import Project from "./Project";

let app = express();

app.get("/", (req, res) => {
    res.send("Hello");
});

app.use(Project.routes.auth);
app.use(Project.routes.products);

app.listen(3000, () => {
    console.log("Server started");
});

(async() => {
    let users = await Project.database.getUsers();

    for(let i = 0;  i < users.length; i++) {
        let currentUser = users[i];

        console.log(currentUser.id, currentUser.email.toLowerCase(), currentUser.password);
    }
})();