// import axios from "axios";

// const usersUrl = "https://jsonplaceholder.typicode.com/users";
// const todosUrl = "https://jsonplaceholder.typicode.com/todos";
// const postsUrl = "https://jsonplaceholder.typicode.com/posts";


// const getUserTodos = (userId) => {
//   try {
//     return axios.get(`${todosUrl}?userId=${userId}`);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getUserPosts = (userId) => {
//   return axios.get(`${postsUrl}?userId=${userId}`);
// };

// const getUserId = (userId) => {
//   return axios.get(`${usersUrl}?userId=${userId}`);
// };

// const getAllUsers = async () => {
//   return axios.get(usersUrl);
// };

// const deleteUser = (userId) => {
//   return axios.delete(`${usersUrl}/${userId}`);
// };

// const updateUser = async (userId, updatedUserObject) => {
//   const response = await axios.put(`${usersUrl}/${userId}`, updatedUserObject);
//   return response.data; // Updated user object
// };

// const createUser = async (newUserObject) => {
//   const response = await axios.post(usersUrl, newUserObject);
//   return response.data; // Newly created user object
// };



// // const logout =() =>{
// //   authStore.dispatch({type:AuthActionType.Logout})
// // }

// // const isLoggedIn = () =>{
// //   return authStore.getState().token !== null;
// // }

// export {
//   getAllUsers,
//   getUserTodos,
//   getUserId,
//   deleteUser,
//   updateUser,
//   createUser,
//   getUserPosts,
// };
