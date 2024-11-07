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
    resolver: zodResolver(issueSchema),
  });
  return <div></div>;
};
```

## use Zod schema to infer the form-field types

first install this `"@hookform/resolvers": "^3.3.1",` package which allows us to use integrate react-hook-form with Zod

here is how to have a Zod schema in one place and use it with React-hook-form

`type IssueForm = z.infer<typeof issueSchema>;`

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
import { issueSchema } from "@/app/validationSchemas";
import { z } from "zod";
// defining an interface for the form fields like this is redundant
// interface IssueForm {
//   title: string;
//   description: string;
// }
// but the good thing we can use zod to generate/infer this type for us like the following:
type IssueForm = z.infer<typeof issueSchema>;

const NewIssuePage = () => {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(issueSchema),
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

## fixing the error that appears in the console while visiting the `http://localhost:3000/issues/new` page

```terminal
⨯ ReferenceError: navigator is not defined
    at __webpack_require__ (D:\Courses\Next.Js\issue-tracker\.next\server\webpack-runtime.js:33:43)
    at __webpack_require__ (D:\Courses\Next.Js\issue-tracker\.next\server\webpack-runtime.js:33:43)
    at __webpack_require__ (D:\Courses\Next.Js\issue-tracker\.next\server\webpack-runtime.js:33:43)
    at eval (./app/issues/new/page.tsx:21:80)
    at (ssr)/./app/issues/new/page.tsx (D:\Courses\Next.Js\issue-tracker\.next\server\app\issues\new\page.js:292:1)
    at Object.__webpack_require__ [as require] (D:\Courses\Next.Js\issue-tracker\.next\server\webpack-runtime.js:33:43)
digest: "1299040761"
 GET /issues/new 500 in 717ms
```

this error happens because the `SimpleMDE` is a client-side component and navigator is a browser api but Next.js is initially rendering all pages on the server so this happens

to solve it use `lazy loading`

1. import `dynamic`
2. make a constant with the same name as the target component in this case `SimpleMDE`
3. call the `dynamic` function first-arg is a callback returning the result of importing the target component, the second-arg is a configuration object configure the rendering behavior
4. the constant we declared is gonna replace the initial import of the component

```tsx
import dynamic from "next/dynamic";

//... the reset

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const Component = () => {
  return (
    <>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMDE placeholder="Description" {...field} />
        )}
      />
    </>
  );
};
```

the `Controller` here is just to make third-party components integrate with `react-hook-form`

## Improve imports

```ts
// import and exporting one by one

// import ErrorMessage from "./ErrorMessage";
// import Spinner from "./Spinner";
// import IssueStatusBadge from "./IssueStatusBadge";
// import Link from "./Link";

// export { ErrorMessage, Spinner, IssueStatusBadge, Link };

// import and export in one go

export { default as ErrorMessage } from "./ErrorMessage";
export { default as Spinner } from "./Spinner";
export { default as IssueStatusBadge } from "./IssueStatusBadge";
export { default as Link } from "./Link";
```

## Single Responsibility Principle

**SRP**: Software entities should have a single responsibility.

### Applying SRP

before applying SRP

```tsx
import { IssueStatusBadge } from "@/app/components";
import prisma from "@/prisma/client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import delay from "delay";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
// too many import statements in a single file is a sign of violating SRP
interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  await delay(2000);
  if (!issue) notFound();

  // our pages should have only one responsibility which is LAYOUT! everything else is not it's responsibility
  return (
    // <Grid columns={{ initial: "1", md: "2" }} gap={"5"}> and two columns </Grid> is the layout
    <Grid columns={{ initial: "1", md: "2" }} gap={"5"}>
      <Box>
        // details of this colum should go in a separate component
        <Heading>{issue.title}</Heading>
        <Flex gap={"3"} my={"3"}>
          <IssueStatusBadge status={issue.status} />
          <Text>{issue.createdAt.toDateString()}</Text>
        </Flex>
        <Card className="prose" mt="4">
          <ReactMarkdown>{issue.description}</ReactMarkdown>
        </Card>
      </Box>
      <Box>
        // as well as this column content
        <Button>
          <Pencil2Icon />
          <Link href={`/issues/${issue.id}/edit`}>Edit Issue</Link>
        </Button>
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
```

after applying SRP

```tsx
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/issues/${issueId}/edit`}>Edit Issue</Link>
    </Button>
  );
};

export default EditIssueButton;
```

the details component is now a separate component

```tsx
import { IssueStatusBadge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <Heading>{issue.title}</Heading>
      <Flex gap={"3"} my={"3"}>
        <IssueStatusBadge status={issue.status} />
        <Text>{issue.createdAt.toDateString()}</Text>
      </Flex>
      <Card className="prose" mt="4">
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
```

as well as edit button

```tsx
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Link from "next/link";

const EditIssueButton = ({ issueId }: { issueId: number }) => {
  return (
    <Button>
      <Pencil2Icon />
      <Link href={`/issues/${issueId}/edit`}>Edit Issue</Link>
    </Button>
  );
};

export default EditIssueButton;
```

Note: use `_components` to exclude this folder from the routing system even if you add a page file init

`PUT` function is used to update an entire object on the server.

`PATCH` function is used to update parts of an object on the server.

## Understand Caching in Next.js

In Next there is Three layers of caching

### Data Cache:

When we fetch data using `fetch()`, whenever we use fetch to get data Next stores the results to the data-cache so next time we ask for the same piece of data Next will not make a request to get the data again instead it's gonna return the results from the cache, this data is permanently stored in the file-system until we re-deploy the website/app

```js
fetch("url", { cache: "no-cache" }); // to disable the caching
fetch("url", { next: { revalidate: 3600 } }); // specify a time limit to refresh cached data
```

### Full Route Cache (Cache on the Server)

Used to store the output of statically rendered routes

**Note**: routes that has no parameter is considered static by default

Rendering in Next falls into two catagories:

1. Static (at build time, when we build our app for deploying)
2. dynamic (at request time, before and after our app is deployed )

```terminal

Route (app)                              Size     First Load JS
┌ ○ /                                    138 B          87.5 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ƒ /api/issues                          0 B                0 B
├ ƒ /api/issues/[id]                     0 B                0 B
├ ○ /issues                              1.08 kB         168 kB
├ ƒ /issues/[id]                         1.08 kB         168 kB
├ ƒ /issues/[id]/edit                    1.28 kB         143 kB
└ ○ /issues/new                          1.28 kB         143 kB
+ First Load JS shared by all            87.3 kB
  ├ chunks/117-37233ba610560b68.js       31.6 kB
  ├ chunks/fd9d1056-3750f1c68fb99acb.js  53.6 kB
  └ other shared chunks (total)          2.09 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

in the output above the `localhost:3000/issues` page is rendered statically so if you create a new issue it is not gonna be shown when you're redirected to the `issues/` page!

to solve it we need to somehow disable the cache in `issue` page and make it render dynamically

`https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config` is the page having hints of solution

back into the `/issues` page

```tsx
import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components";
import IssueActions from "./IssueActions";

const IssuesPage = async () => {
  const issues = await prisma.issue.findMany();
  return (
    <div>
      <IssueActions />
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
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
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

export const dynamic = "force-dynamic"; // this route segment tells Next to opt-out this page from static rendering

export default IssuesPage;
```

```terminal

Route (app)                              Size     First Load JS
┌ ○ /                                    138 B          87.5 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ƒ /api/issues                          0 B                0 B
├ ƒ /api/issues/[id]                     0 B                0 B
├ ƒ /issues                              1.08 kB         168 kB
├ ƒ /issues/[id]                         1.08 kB         168 kB
├ ƒ /issues/[id]/edit                    1.28 kB         143 kB
└ ○ /issues/new                          1.28 kB         143 kB
+ First Load JS shared by all            87.3 kB
  ├ chunks/117-37233ba610560b68.js       31.6 kB
  ├ chunks/fd9d1056-3750f1c68fb99acb.js  53.6 kB
  └ other shared chunks (total)          2.09 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

```

## Router Cache (Client-side Cache)

This type of cache is used to store the payload of pages in the browser as the user navigates through our pages.

Next Router automatically stores the content of pages so as the user navigates back and forth between pages they will have a fast navigation experience

- to store payload of pages in the browser
- lasts for a session
- gets refreshed when we reload

pages stored in the browser also gets refreshed after a certain period of time

**Note**: We can tell Next to refresh a certain page!

```tsx
const onSubmit = handleSubmit(async (data) => {
  try {
    setIsSubmitting(true);
    if (issue) axios.patch(`/api/issues/${issue.id}`, data);
    else await axios.post("/api/issues", data);

    router.push("/issues");
    router.refresh(); // this line tells Next to refresh the contents of this route, in this case "/issues"
  } catch (error) {
    setIsSubmitting(false);
    setError("An unexpected error occurred!");
  }
});
```

## Protecting routes

to protect routes we need to use **middleware** since we're using **next-auth**.

in the root of the project create a file named `middleware.ts` with the following content:

```tsx
// all the logic is already defined and provided we just need to use it according to our application needs

// first of all we need to export "next-auth/middleware"
export { default } from "next-auth/middleware";

// to protect routes all we need is to export this config options
// matchers is an array of routes to be protected (you just put the route starting with a "/")
// NOTE: for the second element "/issues/edit/:id+" we need to apply a modifier to "id" parameter
// "/issues/edit/:id+" this means one or more parameters
export const config = {
  matcher: ["/issues/new", "/issues/edit/:id+"],
};
```

### Hiding delete and edit buttons

in the "/issues/[id]/page" file use the `getServerSession` which takes auth-options which is

this file is in the `app/api/auth/[...nextauth]/route.ts]` with the following content

```ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// add "!" marks at the end of env parameters to tell TS we have values for those!

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
// the object given to the NextAuth is the auth-options we want and need in the "getServerSession" function
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
```

move the auth-options in a separate file in the root `app/auth` as following

```ts
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import { NextAuthOptions } from "next-auth";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

export default authOptions;
```

then import an use it for the `app/api/auth/[...nextauth]/route.ts]` as well as in the `app/issues/[id]/page.tsx` for the `getServerSession` function

### Protect specific routes

in the `app/api/issues` in the **POST** function first check if there is a session object as the first thing in the **POST** handler, if not return a response with a 401 status code

```ts
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({}, { status: 401 });
```

## Using React Query for Fetching data

### Setting up the React Query

first create a **provider component** in the root of the project

```tsx
"use client";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

// QueryClient is the object where all the cache, refresh, errors of api calls get stored
// the single source of truth for all external resources
const queryClient = new QueryClient();

const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    // return a provider component which is using react-context to provide the same data for all
    // the component-tree
    // this "QueryClientProvider" takes a client props which is that "QueryClient" instance at top
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  );
};

export default QueryClientProvider;
```

### Calling a backend end-point

```tsx
const AssigneeSelect = () => {
  useQuery({
     queryKey: ["users"], // this queryKey is a unique key and used for caching purposes
    queryFn: () => axios.get("/api/users").then(res =>res.data) // React-Query doesn't call end-points on it's own, instead you can use "fetch()" or "axios" to call the backend
    staleTime: 60 * 1000, // 60s time , time delay between refetching data
    retry: 3, // times to retry if can't get the data
    });


  return (
    <Select.Root>
      <Select.Trigger placeholder={"Assign..."} />

      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          {users.map((user) => (
            <Select.Item value={user.id} key={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
```
