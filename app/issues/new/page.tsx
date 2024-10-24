"use client";

import { Button, TextArea, TextField } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root>
        <TextField.Input placeholder="Title" />
      </TextField.Root>

      <SimpleMdeReact placeholder="Description" />

      <Button>Submit </Button>
    </div>
  );
};

export default NewIssuePage;
