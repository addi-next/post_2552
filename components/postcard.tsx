"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    image: string;
    created_at: string;
  };
  isadmin: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, isadmin }) => {
  const [isVertical, setisVertical] = useState(false);
  useEffect(() => {
    // 只在客户端运行
    if (window.innerWidth < window.innerHeight) {
      setisVertical(true);
    }

    const handleResize = () => {
      setisVertical(window.innerWidth < window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          className="delete-button-parent"
        >
          <Card className="overflow-hidden rounded-xl relative hover:shadow-2xl focus-visible:outline-none">
            {post.image && <img src={post.image} alt={post.title} />}
            <CardHeader className="p-4 pb-2">{post.title}</CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-sm text-gray-500 line-clamp-2">
                {post.content}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-gray-400">
              {formatDateTime(post.created_at)}
            </CardFooter>
            {isadmin && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                }}
                className="absolute top-2 right-2 z-10 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground h-8 w-8 flex items-center justify-center shadow-md pointer-events-auto"
                onClick={async (event: React.MouseEvent<HTMLButtonElement>) => {
                  event.stopPropagation();
                  const { success, error } = await deletePostAction(post.id);
                  if (success) {
                    toast({
                      title: "删除成功",
                      description: "博文已被删除",
                    });
                    window.location.reload();
                  } else {
                    toast({
                      variant: "destructive",
                      title: "删除失败",
                      description: error,
                      action: (
                        <ToastAction altText="Try again">重试</ToastAction>
                      ),
                    });
                  }
                }}
              >
                <Trash2 size={16} />
              </motion.button>
            )}
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent
        className={
          "p-0 flex gap-0 overflow-hidden max-h-[90vh] focus:outline-none " +
          (isVertical
            ? " flex-col max-w-[85vw] overflow-y-scroll hide-scrollbar"
            : " flex-row ")
        }
      >
        <div className="flex place-items-center justify-center bg-gray-100">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className={
                isVertical ? "max-w-[85vw]" : "max-w-[50vw] max-h-[90vh]"
              }
            />
          ) : (
            <div className="flex items-center justify-center p-12 text-gray-400">
              无图片
            </div>
          )}
        </div>
        <div
          className={
            "px-8 border-gray-200 " +
            (isVertical
              ? "my-6 px-4"
              : "w-[30vw] overflow-y-scroll hide-scrollbar border-l my-8")
          }
        >
          <DialogHeader className="p-0 space-y-4">
            <DialogTitle className="text-xl font-bold">
              {post.title}
            </DialogTitle>
            <div className="text-sm text-gray-400">
              {formatDateTime(post.created_at)}
            </div>
            <div className="text-md text-gray-700 whitespace-pre-wrap">
              {post.content}
            </div>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const formatDateTime = (createdAt: string) => {
  const date = new Date(createdAt);
  return date
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(/,/, "");
};

export default PostCard;
