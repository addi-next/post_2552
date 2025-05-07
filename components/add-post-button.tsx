import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import PostFormInput from "./post-form-input";
import MotionButton from "./ui/motionButton";

const AddPostButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MotionButton className="flex items-center gap-2">
          <PlusCircle size={16} />
          <span>写一条博文</span>
        </MotionButton>
      </DialogTrigger>
      <DialogContent className=" overflow-y-scroll hide-scrollbar w-[90vw] max-h-[90vh] max-w-[400px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-xl font-bold">
            发布新博文
          </DialogTitle>
        </DialogHeader>
        <PostFormInput />
      </DialogContent>
    </Dialog>
  );
};

export default AddPostButton;
