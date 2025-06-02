import express from "express";
import Project from "./Project";

let app = express();



(async() => {
    /*
    let users = await Project.database.getUsers();

    for(let i = 0;  i < users.length; i++) {
        let currentUser = users[i];

        console.log(currentUser.id, currentUser.email.toLowerCase(), currentUser.password);
    }
    */

    let sendWelcomeEmail = (email:string) => {
        console.log("Sending email to " + email);
    }

    interface TaskrunnerFunction<T = any> {
        (type:string, data:T):Promise<any>
    }

    interface TaskFunctions {
        [key:string]:TaskrunnerFunction
    }

    let taskFunctions:TaskFunctions = {};

    let addTask = async(type:string, data:any) => {
        let result = await Project.database.connection.execute("INSERT INTO background_tasks (type, data) VALUES ('" + type + "', '" + JSON.stringify(data) + "')");
        console.log(result);
    }

    let sendInvitation:TaskrunnerFunction = async(type:string, data:any) => {
        sendWelcomeEmail(data.email);
        await addTask("updateBookkeeping", {});
    }
    taskFunctions["sendInvitation"] = sendInvitation;

    taskFunctions["test"] = async(type:string, data:any) => {
        console.log("Task function: " + type);
    };

    let implementFunction:TaskrunnerFunction = async(type:string, data:any) => {
        console.log("Implement this type: " + type);
    };

    taskFunctions["updateBookkeeping"] = implementFunction;
    taskFunctions["somethingElse"] = implementFunction;

    
    await addTask("sendInvitation", {"email": "mattias@example.com"});
    

    setInterval(async() => {
        //console.log("Timer");

        let result = await Project.database.connection.execute("SELECT * FROM background_tasks WHERE status = 0");

        let tasks = result[0] as any[];
        for(let i = 0; i < tasks.length; i++) {
            let task = tasks[i];

            let id:number = task.id;
            console.log(id);
            let type:string = task.type;
            let isOk = true;

            if(taskFunctions[type]) {
                let data = JSON.parse(task.data);
                await taskFunctions[type](type, data);
            }
            else {
                console.warn("No type named " + type);
                isOk = false;
            }

            if(isOk) {
                await Project.database.connection.execute("UPDATE background_tasks SET status = 1 WHERE id = " + id);
            }
            else {
                await Project.database.connection.execute("UPDATE background_tasks SET status = 2 WHERE id = " + id);
            }
        }
        
    }, 1*1000);

    app.get("/", async(req, res) => {
        res.send("Hello");
        await addTask("sendInvitation", {"email": "mattias@example.com"});
    });
    
    //app.use(Project.routes.auth);
    //app.use(Project.routes.products);
    
    app.listen(3000, () => {
        console.log("Server started");
    });
})();