"use client";

import "easymde/dist/easymde.min.css";
import { Button, TextField } from "@radix-ui/themes";
// import Link from "next/link";
import React from "react";
import SimpleMdeReact from "react-simplemde-editor";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IssueForm {
  title: string;
  description: string;
}
const NewIssuePage = () => {
  const { register, handleSubmit, control } = useForm<IssueForm>();

  const router = useRouter()
  return (
    <form
      onSubmit={handleSubmit(
        async (data) => {
          await axios.post("/api/issues", data)
          router.push("/issues")
        }
      )}
      className="max-w-xl space-y-3"
    >
      <TextField.Root>
        <TextField.Input placeholder="Title" {...register("title")} />
      </TextField.Root>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMdeReact placeholder="Description" {...field} />
        )}
      />

      <Button>Submit </Button>
    </form>
  );
};

export default NewIssuePage;
