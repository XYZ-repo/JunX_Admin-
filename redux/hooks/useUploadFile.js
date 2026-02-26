import { apipost } from "../api";

export default function useUploadFile() {
  // Upload image
  const uploadImage = async (data) => {
    try {
      const res = await apipost("api/v1/upload", data);
      return res?.data?.data;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  };

  return {
    uploadImage,
  };
}
