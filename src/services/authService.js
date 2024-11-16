import axiosInstance from "./axiosInstance";

const registerUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/register-user", {
      email,
      password, // Corrected the variable name here
    });
    console.log(response);
  } catch (error) {
    console.error("Error adding user", error);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/login-user", {
      email,
      password, // Corrected the variable name here
    });

    // Extract token and userProfile from the response data
    const token = response.data.token;
    const userProfile = response.data.userProfile;

    // Store the token and userProfile in localStorage
    localStorage.setItem("authToken", token);
    localStorage.setItem("userProfile", JSON.stringify(userProfile)); // Store user profile as a string

    // Optionally, you can return the response or token to use later
    return response;
  } catch (error) {
    console.error("Error logging in user", error);
    throw error;
  }
};


const logoutUser = async () => {
  try {
    // Make a POST request to logout the user on the backend
    const response = await axiosInstance.post("/logout-user");

    // If the response is successful, remove the user data from localStorage
    if (response.status === 200) {
      localStorage.removeItem("authToken"); // Remove the token from localStorage
      console.log("User logged out successfully");
    }

    return response; // Return the response from the backend

  } catch (error) {
    console.error("Error logging out", error);
    throw error; // Rethrow the error to handle it elsewhere
  }
};


export default {
  registerUser,
  loginUser,
  logoutUser,
};
