"use client";

import PromptInputForm, { PromptFormData } from "@/components/deployments/PromptInputForm";
import { useAuth } from "@/contexts/AuthContext";
import { postJob } from "@/lib/api/jobs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function JobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

    const handlePromptSubmit = (data: PromptFormData) => {
      console.log('Form submitted:', data);
      postJob(data)
        .then((response) => {
          console.log('Job posted successfully:', response);
        })
        .catch((error) => {
          console.error('Error posting job:', error);
        });
  };

  return (
    <div>
      <PromptInputForm onSubmit={handlePromptSubmit} />
    </div>
  );
}