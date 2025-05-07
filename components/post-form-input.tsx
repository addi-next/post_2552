"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { addPostAction } from "@/app/actions";
import { Textarea } from "./ui/textarea";
import SubmittButton from "./submitbutton";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { Label } from "./ui/label";

const PostFormInput = () => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "图片过大",
          description: "请上传小于3MB的图片",
        });
        e.target.value = "";
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onsubmitfuction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认提交

    try {
      setIsSubmitting(true);
      const form = e.currentTarget;
      const formData = new FormData(form);
      const title = formData.get("title") as string;
      if (!title.trim()) {
        toast({
          variant: "destructive",
          title: "标题不能为空",
          description: "请输入博文标题",
        });
        return;
      }

      const { success, error } = await addPostAction(formData);
      if (success) {
        toast({
          title: "发布成功",
          description: "博文已成功发布",
        });
        window.location.reload(); // 刷新页面
      } else {
        toast({
          variant: "destructive",
          title: "提交失败",
          description: error || "发布失败，请稍后重试",
          action: <ToastAction altText="Try again">重试</ToastAction>,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "提交失败",
        description: "发布时发生错误，请稍后重试",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={onsubmitfuction}>
      <div>
        <Label htmlFor="title" className="mb-2 block">
          博文标题
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          placeholder="请输入标题"
        />
      </div>

      <div>
        <Label htmlFor="content" className="mb-2 block">
          博文内容
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="请输入内容"
        />
      </div>

      <div>
        <Label htmlFor="image" className="mb-2 block">
          上传图片
        </Label>
        <Input
          id="image"
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleImageChange}
        />
        <p className="text-sm text-muted-foreground mt-1">
          支持 JPG/PNG/GIF，大小不超过 3MB
        </p>
      </div>

      {imagePreview && (
        <div className="mt-2 border rounded-md p-2">
          <p className="text-sm mb-1 text-gray-500">图片预览:</p>
          <img
            src={imagePreview}
            alt="预览图"
            className="max-h-[200px] max-w-full object-contain"
          />
        </div>
      )}

      <div className="mt-2">
        <SubmittButton className="w-full">发布博文</SubmittButton>
      </div>
    </form>
  );
};

export default PostFormInput;
