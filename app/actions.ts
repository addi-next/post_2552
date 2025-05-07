"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { join } from "path";
import { writeFile } from "fs/promises";
export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};
export async function signInWithGoogle() {
  const supabase = await createClient();
  const redirectTo = new URL(
    "/auth/callback",
    "http://localhost:3000"
  ).toString(); // 开发环境
  // const redirectTo = new URL('/auth/callback', 'https://your-domain.com').toString(); // 生产环境

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Google 登录错误:", error);
    return redirect("/signin?error=Google 登录失败");
  }

  if (data.url) {
    console.log("Redirecting to Google:", data.url);
    redirect(data.url);
  }
}
export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const addPostAction = async (formData: FormData) => {
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const file = formData.get("image") as File;
  const supabase = await createClient();
  let imageurl = "";
  if (file.size > 0) {
    const objectkey = `posts/${file.name}`;

    const { data, error: uploadError } = await supabase.storage
      .from("post-image")
      .upload(objectkey, file);
    if (uploadError) {
      console.error(uploadError.message);
      return encodedRedirect("error", "/", "Could not upload image");
    }
    const { data: publicUrlData } = supabase.storage
      .from("post-image")
      .getPublicUrl(data.path);
    imageurl = publicUrlData.publicUrl;
  }
  const { error } = await supabase.from("post").insert({
    title,
    content,
    image: imageurl,
  });

  if (error) {
    console.error(error.message);
    return { suscess: false, error: error.message };
  }
  return { success: true };
};

export const deletePostAction = async (postId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("post").delete().eq("id", postId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};
