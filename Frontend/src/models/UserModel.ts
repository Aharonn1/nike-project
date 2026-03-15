import RoleModel from "./RoleModel";

class UserModel {
    userId: number = 0;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    password: string = '';
    role?: RoleModel = RoleModel.User;
    updateStock?: number = 1;
    registrationDate?: string = new Date().toISOString().slice(0, 10);
}

export default UserModel;