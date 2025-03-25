import axios from "axios";
import appConfig from "../Utils/AppConfig";

// Assuming UserModel and CredentialsModel are defined elsewhere
const AuthService = {
  
  async register(user) {
    try {
      const response = await axios.post(appConfig.registerUrl, user);
      const token = response.data;
      console.log("Registration successful:", token);
      // Handle token storage or dispatch based on your application logic (e.g., Redux)
      return token; // Or return a success message/object
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration errors gracefully, e.g., display error messages to the user
      throw error; // Re-throw the error for further handling if necessary
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(appConfig.loginUrl, credentials);
      const token = response.data;
      console.log("Login successful:", token);
      // Handle token storage or dispatch based on your application logic (e.g., Redux)
      return token; // Or return a success message/object
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login errors gracefully, e.g., display error messages to the user
      throw error; // Re-throw the error for further handling if necessary
    }
  },

  logout() {
    // Handle token removal or dispatch based on your application logic (e.g., Redux)
    console.log("Logged out successfully");
  },

  isLoggedIn() {
    // Implement logic to check for stored token or state based on your application setup
    // return true/false or a more detailed check if needed
    return false; // Replace with your logic
  }
}

const authService = new AuthService();
export default authService;
