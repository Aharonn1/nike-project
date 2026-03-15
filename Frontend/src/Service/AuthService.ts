import axios from "axios";
import appConfig from "../Utils/AppConfig";
import CredentialsModel from "../models/CredentialsModel";
import UserModel from "../models/UserModel";


class AuthService {
  async register(user: UserModel): Promise<string> {
    try {
      const response = await axios.post(appConfig.registerUrl, user);
      const token = response.data;
      console.log("Registration successful:", token);
      return token;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async login(credentials: CredentialsModel): Promise<string> {
    try {
      const response = await axios.post(appConfig.loginUrl, credentials);
      const token = response.data;
      console.log("Login successful:", token);
      return token;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  logout(): void {
    console.log("Logged out successfully");
  }

  isLoggedIn(): boolean {
    return false; // Replace with your logic
  }
}

const authService = new AuthService();
export default authService;