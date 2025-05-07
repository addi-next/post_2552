// components/PostList.tsx
"use client"; // <--- 标记为客户端组件

import React from "react";
import PostCard from "./postcard"; // 确保路径正确
import { use } from "react";
import useMasonry from "@/utils/useMasonry";
import { motion } from "framer-motion";

// 定义 Promise 解析后的类型
type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image: string;
};

type PostsResult = {
  data: Post[] | null;
  error: any | null; // 更具体错误类型更佳
};

// 定义 Props 类型，接收 Promise
interface PostsListProps {
  postsPromise: Promise<PostsResult>;
  isadmin: boolean;
}

const PostList = ({ postsPromise, isadmin }: PostsListProps) => {
  const { data: posts, error } = use(postsPromise);

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-500 border border-red-200 rounded-md bg-red-50">
        加载帖子时出错: {error.message}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full p-6 text-center text-gray-500 border border-gray-200 rounded-md">
        暂无内容，请创建第一条博文。
      </div>
    );
  }

  // 父容器的变体定义
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 子元素之间的延迟
        delayChildren: 0.3, // 父元素完成后子元素开始的延迟
      },
    },
  };

  // 子元素的变体定义
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const masonryContainer = useMasonry();

  return (
    // 使用 motion.div 包装容器并应用变体
    <motion.div
      ref={masonryContainer}
      className="grid items-start gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          variants={itemVariants}
          custom={index}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 200,
          }}
        >
          <PostCard post={post} isadmin={isadmin} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PostList;
