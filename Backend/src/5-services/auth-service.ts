import { OkPacket } from "mysql";
import cyber from "../2-utils/cyber";
import dal from "../2-utils/dal";
import { AuthenticationError, ValidationError } from "../4-models/client-errors";
import RoleModel from "../4-models/role-model";
import UserModel from "../4-models/user-model";


async function register(user: UserModel): Promise<string> {

    // TODO - add Validation :
    // user.validate();
    // If email token:
    if (await isEmailTaken(user.email)) throw new ValidationError(`Email ${user.email} already taken`);

    // New USer is a USer role:
    user.role = RoleModel.User;

    // Hash Password:
    user.password = cyber.hashPassword(user.password);

    // // Create sql query:
    // const updateStockValue = user.updateStock;
    // // אם updateStockValue אינו מספר, הגדר אותו כ-0 (או ערך ברירת מחדל אחר)
    // user.updateStock = isNaN(updateStockValue) ? 1 : updateStockValue;

    const sql = `INSERT INTO users (firstName, lastName, email, password, role, registrationDate, updateStock) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const result: OkPacket = await dal.execute(sql, user.firstName, user.lastName, user.email, user.password, user.role,
        user.registrationDate, user.updateStock);

        user.userId = result.insertId;
    console.log(result)
    const token = cyber.createNewToken(user);

    return token;
}

async function login(credentials: CredentialsModel): Promise<LoginResponse> {

    // Validation (assuming CredentialsModel has validation logic)

    // Secure Password Hashing
    const hashedPassword = cyber.hashPassword(credentials.password);

    try {
        // Prepared Statement for SQL Injection Prevention
        const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

        // Execute Query with Parameters
        const users = await dal.execute(sql, credentials.email, hashedPassword);

        // Check User Existence
        if (!users.length) {
            throw new AuthenticationError("Incorrect email or password");
        }

        // Extract User Data
        const user = users[0];

        // Generate Token (assuming cyber.createNewToken exists)
        const tokenData = cyber.createNewToken(user);

        // Return Login Response Object
        const loginResponse: LoginResponse = {
            token: tokenData,
            userData: user
        };

        return loginResponse;

    } catch (error) {
        console.error("Login Error:", error);
        throw error; // Re-throw the error for handling in the calling code
    }
}

// Interface for Login Response (assuming types are defined elsewhere)
interface LoginResponse {
    token: string;
    userData: UserModel; // Assuming UserData type exists
}

interface CredentialsModel {
    email: string;
    password: string;
    // Add validation logic here (if not already defined)
}

async function isEmailTaken(email: string): Promise<boolean> {

    // Create sql query:
    const sql = `SELECT EXISTS(SELECT email FROM users WHERE email = ?) AS isExist`;

    // Execute query:
    const arr = await dal.execute(sql, email);

    // Extract count:
    const count = +arr[0].count;

    return count > 0;
}

export default {
    register,
    login,
    isEmailTaken
}