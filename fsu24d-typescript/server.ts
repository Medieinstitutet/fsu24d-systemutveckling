import express, {Request, Response} from 'express';
import { ParsedQs } from "qs";
import { mainCall } from './routes';

let greeting:string = "Hello world!";

console.log(greeting);

const app = express();

interface FormPost {
    id:bigint,
    action:string
}

let body = (req:Request, res:Response) => {

}

let bodyOfTypeAny = (req:Request<{}, any, any, ParsedQs, Record<string, any>>, res:Response<any, Record<string, any>>) => {
    res.send("Hello world!");

    req.body as FormPost //Body is cast from any to
}

let bodyOfCorrectType = (req:Request<{}, any, FormPost, ParsedQs, Record<string, any>>, res:Response<any, Record<string, any>>) => {
    res.send("Hello world!");

    req.body //This is now a form post
}

app.get("/", (req, res) => {

});

app.listen(4001, () => {
    console.log(`Server running at http://localhost:4001`);
})