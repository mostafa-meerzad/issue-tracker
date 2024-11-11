"use client"

import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";

// for the statuses value property we need to use the EXACT values otherwise it's not gonna work!
// for this use the statuses enum we defined in prisma
const statuses: { label: string; value?: Status }[] = [
  { label: "All" }, // for the All we don't need a filter value so make value optional in the type
  { label: "Open", value: "OPEN" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];
const IssueStatusFilter = () => {
  return (
    <Select.Root>
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item key={status.value} value={status.value || ""}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default IssueStatusFilter;
