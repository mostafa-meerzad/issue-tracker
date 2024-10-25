"use client";

import "easymde/dist/easymde.min.css";
import { Button, Callout, Text, TextField } from "@radix-ui/themes";
// import Link from "next/link";
import React, { useState } from "react";
import SimpleMdeReact from "react-simplemde-editor";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BiInfoCircle } from "react-icons/bi";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from "zod";
// defining an interface for the form fields like this is redundant
// interface IssueForm {
//   title: string;
//   description: string;
// }
// but the good thing we can use zod to generate/infer this type for us like the following:
type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const router = useRouter();

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root className="mb-5" color="red" role="alert">
          <Callout.Icon>
            <BiInfoCircle />
          </Callout.Icon>
          <Callout.Text>something went wrong</Callout.Text>
        </Callout.Root>
      )}
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            await axios.post("/api/issues", data);
            router.push("/issues");
          } catch (error) {
            // console.log(error);
            setError("An unexpected error occurred!");
          }
        })}
        className=" space-y-3"
      >
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        {errors.title && <Text color="red" as="p">{errors.title.message}</Text>}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact placeholder="Description" {...field} />
          )}
        />
        {errors.description && (
          <Text color="red" as="p">{errors.description.message}</Text>
        )}
        <Button>Submit </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
