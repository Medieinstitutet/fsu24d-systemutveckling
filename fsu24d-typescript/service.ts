import mysql from "mysql2/promise";

/*
interface AppProps {
    url:string
}

let App:React.FC<AppProps> = (props:AppProps) => {

}
*/

interface TokenAccess {
    ip: string,
    accessToken: string,
    refreshToken: string
}

interface UserRole {
    isAdmin: boolean,
    roles: string[]
}

interface User<T extends string | TokenAccess = string, T2 extends UserRole = UserRole> {
    username: string,
    auth: T
}

let defaultUser:User = {username: "M", auth: "password123"};

let normalUser:User<string, any> = {username: "M", auth: "password123"};
let systemUser:User<TokenAccess, any> = {username: "apiUser1", auth: {
    ip: "10.4.2.123",
    accessToken: "sdasdasdasdasdasd",
    refreshToken: "asdasdvwewevwevwv"
}}

interface Product {
    id: bigint;
}

interface Order {
    firstName: string;
}

let getApiData = async <T>(url:string):Promise<T> => {
    let baseUrl = "https://api.example.com/";

    let result = await (await fetch(baseUrl + url)).json();

    return result as T;
}

(async () => {
    let orders = await getApiData<Order[]>('orders');
    orders[0].firstName
    getApiData<Product[]>('products');
    let product = await getApiData<Product>('products/1');
    product.id
})();

let connection = mysql.createPool({
    host: "localhost",
    database: "uppgift3",
    user: "root",
    password: "notSecureChangeMe"
});

interface DatabaseUser extends mysql.RowDataPacket {
    id: bigint,
    email: string
}

let getUsers = async ():Promise<DatabaseUser[]> => {
    let [rows] = await connection.execute<DatabaseUser[]>("SELECT * FROM users");
    
    return rows;
};

let getUserById = async(id:bigint):Promise<DatabaseUser|null> => {
    let [rows] = await connection.execute("SELECT * FROM users WHERE id = " +id);
    
    return (rows as DatabaseUser[])[0] as DatabaseUser;
}

let getUserByEmail = async(email:string):Promise<DatabaseUser|null> => {
    let [rows] = await connection.execute("SELECT * FROM users WHERE email = " +email);
    
    return (rows as DatabaseUser[])[0] as DatabaseUser;
}

async function getUser(id:number):Promise<DatabaseUser|null>;
async function getUser(email:string):Promise<DatabaseUser|null>;
async function getUser(identifer:number|string):Promise<DatabaseUser|null> {
    if(typeof(identifer) === "string") {
        let [rows] = await connection.execute("SELECT * FROM users WHERE email = " + identifer);
    
        return (rows as DatabaseUser[])[0] as DatabaseUser;
    }
    else {
        let [rows] = await connection.execute("SELECT * FROM users WHERE id = " + identifer);
    
        return (rows as DatabaseUser[])[0] as DatabaseUser;
    }
}

getUser(1);
getUser("mattias@example.com");