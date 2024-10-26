# Notes

use `usePathName()` hook to get the current path name i,e: you're in **localhost:3000/dashboard** then you call `usePathName()` hook and you get `/dashboard` as the result.

use `classnames` package to organize classesNames conditionally when using Tailwindcss

```tsx
<Link
  href={link.href}
  className={classnames({
    "text-zinc-500": currentPath !== link.href,
    "text-zinc-900": currentPath === link.href,
    " hover:text-zinc-900 transition-colors": true,
  })}
>
  {link.label}
</Link>
```

without `classname` package

```tsx
<Link
  href={link.href}
  className={`${
    currentPath === link.href ? "text-zinc-900" : "text-zinc-500"
  }  hover:text-zinc-900 transition-colors": true`}
>
  {link.label}
</Link>
```

## classnames package working:

you call `classnames()` function in the `className` attribute and provide an object where `keys` are the `styles` and values are `boolean` values if `true` styles are applied, if `false` not applied

## Configuring Prisma

use `@db` to change the default values provided

`@db.Varchar(charNum)` to specify the varChar yourself the default value for `String` is `varchar(191)`

when using `MySQL` with prisma you can define a type using `enum`

`@updatedAt` makes the DB-engine to use the date-time of the moment the data-entry is updated

```prisma
model Issue {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(255)
  description String   @db.Text
  status      Status   @default(OPEN)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  OPEN
  IN_PROGRESS
  CLOSED
}
```

## using react-hook-form

when using react-hook-form with TS first define an interface defining the form fields and their types

```tsx
interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  return <div></div>;
};
```

## use Zod schema to infer the form-field types

first install this `"@hookform/resolvers": "^3.3.1",` package which allows us to use integrate react-hook-form with Zod

here is how to have a Zod schema in one place and use it with React-hook-form

`type IssueForm = z.infer<typeof createIssueSchema>;`

```tsx
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
        {errors.title && (
          <Text color="red" as="p">
            {errors.title.message}
          </Text>
        )}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMdeReact placeholder="Description" {...field} />
          )}
        />
        {errors.description && (
          <Text color="red" as="p">
            {errors.description.message}
          </Text>
        )}
        <Button>Submit </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
```

## use react's built-it type for component with children

```tsx
import { Text } from "@radix-ui/themes";
import React, { PropsWithChildren } from "react";

interface Props {
  children: React.ReactNode;
}

const ErrorMessage = ({ children }: Props) => {
  return (
    <Text color="red" as="p">
      {children}
    </Text>
  );
};

export default ErrorMessage;
```

it removes the need for defining a type/interface for just one "children" props

```tsx
import { Text } from "@radix-ui/themes";
import React, { PropsWithChildren } from "react";

const ErrorMessage = ({ children }: PropsWithChildren) => {
  return (
    <Text color="red" as="p">
      {children}
    </Text>
  );
};

export default ErrorMessage;
```

## submit button

remember to disable the submit button after the form is submitted specially if the form is dealing with money/purchase

```tsx
<Button disabled={isSubmitting}>Submit {isSubmitting && <Spinner />}</Button>
```

# Showing the Issues

## simulating a slow connection using delay

import delay function to simulate a slow connection

```tsx
import delay from "delay";
const IssuesPage = async () => {
  const issues = await prisma.issue.findMany();// call to a service
  // right after that service call call the delay(delay-in-milliseconds)
  // it return a promise so need to await it
  await delay(2000);
  return (
    component content
  )
  }
```

### React-loading-skeleton

instead of data in your component you just render `<Skeleton/>` component that simple

#### the component

```tsx
import prisma from "@/prisma/client";
import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import IssueStatusBadge from "../components/IssueStatusBadge";
//import delay function to simulate a slow connection
import delay from "delay";

const IssuesPage = async () => {
  const issues = await prisma.issue.findMany();
  await delay(2000);
  return (
    <div>
      <div className="mb-5">
        <Button>
          <Link href={"/issues/new"}>New Issue</Link>
        </Button>
      </div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                {issue.title}
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default IssuesPage;
```

#### the loading component with skeleton rendered

```tsx
import { Table } from "@radix-ui/themes";
import React from "react";
import IssueStatusBadge from "../components/IssueStatusBadge";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingIssuesPage = () => {
  const issues = [1, 2, 3, 4, 5];
  return (
    <div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue}>
              <Table.Cell>
                <Skeleton />
                <div className="block md:hidden">
                  <Skeleton />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default LoadingIssuesPage;
```
