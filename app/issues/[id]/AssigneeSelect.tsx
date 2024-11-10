"use client";

import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton from "@/app/components/Skeleton";
import toast, {Toaster} from "react-hot-toast"

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, // 60s time , time delay between refetching data
    retry: 3, // times to retry if can't get the data
  });

  if (isLoading) return <Skeleton />;

  if (error) return null;

  return (<>
  
  <Select.Root
      defaultValue={issue.assignedToUserId || ""}
      onValueChange={(userId) => {
        // in the patch request below we need userId and issueId
        // axios.patch("/api/issues/")
        // userId is set via the select components where we set "value" property to user.id
        // for issueId we need to get issue as a prop from the page.tsx component
        axios.patch("/api/issues/" + issue.id, {
          assignedToUserId: userId || null,
        }).catch(() => {
          toast.error("Changes could not be saved!")
        });
      }}
    >
      <Select.Trigger placeholder={"Assign..."} />

      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value="">Unassigned</Select.Item>
          {users?.map((user) => (
            <Select.Item value={user.id} key={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  
  <Toaster/>
  </>);
};

export default AssigneeSelect;
