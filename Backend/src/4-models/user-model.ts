import RoleModel from "./role-model";

class UserModel {

    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: RoleModel;
    updateStock: number;
    registrationDate: string = new Date().toISOString().slice(0, 10);

    constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.updateStock = user.updateStock;
        this.registrationDate = user.registrationDate;
    }
}

export default UserModel;