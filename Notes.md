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

when using react-hook-form with TS first define an interface defining the form fields and their types
