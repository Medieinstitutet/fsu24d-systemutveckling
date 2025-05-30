import { Response } from "express";
import Project from "../Project";

let validateLogin = async(username:string, password:string):Promise<boolean> => {
    //METODO: implement this
    return false;
}

export {validateLogin};

let setSession = async(username:string, res:Response):Promise<Project.models.Session> => {
    //METODO: implement this

    return {username: username, expiryDate: (new Date()).valueOf() + 3600}; //MEDEBUG
}

export {setSession};

let saveSessionToDatabase = async(session:Project.models.Session) => {
    //METODO: implement this
}

export {saveSessionToDatabase};

let perfomLogin = async(username:string, res:Response) => {
    let session = await setSession(username, res);
    await saveSessionToDatabase(session);
}

let login = async(username:string, password:string, res:Response):Promise<boolean> => {
    let isOk = await validateLogin(username, password);
    if(isOk) {
        await perfomLogin(username, res);
    }

    return isOk;
}

export {login};
export {perfomLogin as onlyDev_forceLogin};

let resetPassword = async(username:string, newPassword:string, oldPassword:string) => {
   let isOk = await validateLogin(username, oldPassword);
   //METODO: implement this
};

export {resetPassword};