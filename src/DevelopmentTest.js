import Vector from "./Vector.js";
import Vector3d from "./Vector3d.js";

let addVectors = (vector1, vector2) => {
    let returnVector = {x: vector1.x+vector2.x, y: vector1.y+vector2.y};

    return returnVector;
}

let subtractVectors = (vector1, vector2) => {
    let returnVector = {x: vector1.x-vector2.x, y: vector1.y-vector2.y};

    return returnVector;
}

let subtractVectors3d = (vector1, vector2) => {
    let returnVector = {x: vector1.x-vector2.x, y: vector1.y-vector2.y, z: vector1.z-vector2.z};

    return returnVector;
}

let vector1 = {x: 1, y: 1, add: (vector) => {
    vector1.x += vector.x;
    vector1.y += vector.y;
}};
let vector2 = {x: 2, y: 3};
vector1.add(vector2);

let vector1oop = new Vector(1, 1);
let vector2oop = new Vector(2, 3);
let vector3doop = new Vector3d(2, 3, 4);
vector1oop.add(vector2oop);
vector1oop.subtract(vector2oop);

vector3doop.duplicate().subtract(vector2oop.duplicate());















