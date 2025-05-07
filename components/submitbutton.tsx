"use client";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { useEffect } from "react";

type SubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export default function SubmittButton({
  children,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={`px-4 py-2 text-white rounded  disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
      disabled={pending}
    >
      {pending ? (
        <span className="inline-flex">
          <Loader2 className="animate-spin " />
          加载中
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
