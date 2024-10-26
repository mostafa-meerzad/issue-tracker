import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const statusMap: Record<
  Status,
  { label: string; color: "red" | "violet" | "green" }
> = {
  OPEN: { label: "Open", color: "red" },
  IN_PROGRESS: { label: "In Progress", color: "violet" },
  CLOSED: { label: "Closed", color: "green" },
};

const IssueStatusBadge = ({ status }: { status: Status }) => {
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};
// the color property can't be set as following just to prevent from setting it to a random value
// const statusMap :Record<Status, {label: string, color:string}>
//color={statusMap[status].color} // this line in the component raises an error
// to solve it we just need set the color type to exact types
//const statusMap :Record<Status, {label: string, color:"red" | "violet" | "green"}>
export default IssueStatusBadge;
