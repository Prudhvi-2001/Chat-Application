import apiClient from "../interceptors/interceptor";
import { useAuth } from "../components/AuthContext";
export const LoginService = () => {
  const { login } = useAuth();
  const loginT = async (payload) => {
    try {
      const res = await apiClient.post("/auth/signin", payload, {
        skipAuth: true,
      });
      localStorage.setItem("token", res.data.token);
      return res;
    } catch (err) {
      console.log(err);
    }
  };
  const getProfile = async () => {
    try {
      const res =  await apiClient.get("/auth/profile");
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const searchUsers = async(query) =>{
    try {
      const res = await apiClient.get(`/auth/search-users?q=${query}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }
  return {
    loginT,
    getProfile,
    searchUsers
  };
};
