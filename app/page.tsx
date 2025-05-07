import AddPostButton from "@/components/add-post-button";
import { Skeleton } from "@/components/ui/skeleton";
import PostList from "@/components/postList";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页 | 个人博文站",
  description:
    "浏览最新的博客文章、经验分享和技术见解。探索我们精选的内容，获取实用知识和灵感。",
  keywords: ["首页", "最新文章", "博客推荐", "精选内容"],
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const postsBuilder = supabase.from("post").select("*");
  const postsPromise = Promise.resolve(postsBuilder);
  return (
    <div className="px-14 sm:px-20 md:px-36 py-8 ">
      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-1 w-full mb-8">
            {Array.from({ length: 8 }).map((key, index) => (
              <Skeleton
                key={index}
                className="h-[150px] w-[100%] rounded-xl"
              ></Skeleton>
            ))}
          </div>
        }
      >
        <PostList postsPromise={postsPromise} isadmin={user ? true : false} />
      </Suspense>
      {user && <AddPostButton />}
    </div>
  );
}
