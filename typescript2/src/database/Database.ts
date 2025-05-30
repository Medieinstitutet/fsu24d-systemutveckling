import mysql from "mysql2/promise";
import Project from "../Project";

if(!process.env.DB_HOST) {
    console.warn("process.env.DB_HOST not set, using default localhost");
}

let connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE || "uppgift3",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "notSecureChangeMe",
});

export default connection;

let getUsers = async():Promise<Project.models.User[]> => {
    let result = await connection.query("SELECT * from users");

    return result[0] as Project.models.User[];
}

export {getUsers};