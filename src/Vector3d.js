import Vector from "./Vector.js";

export default class Vector3d extends Vector {
    constructor(x = 0, y = 0, z = 0) {
        super(x, y);
        this.z = z;
    }

    subtract(vector) {
        super.subtract(vector);
        
        if(vector instanceof Vector3d) {
            this.z -= vector.z;
        }
    }

    duplicate() {
        return new Vector3d(this.x, this.y, this.z);
    }
}