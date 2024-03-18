import { v2 as cloudinary } from "npm:cloudinary@latest";

cloudinary.config({
  cloud_name: Deno.env.get("CLOUD_NAME"),
  api_key: Deno.env.get("API_KEY"),
  api_secret: Deno.env.get("API_SECRET"),
});

export default cloudinary;
