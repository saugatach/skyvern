import { getClient } from "@/api/AxiosClient";
import { TaskApiResponse } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import { basicTimeFormat } from "@/util/timeFormat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { useCredentialGetter } from "@/hooks/useCredentialGetter";

function QueuedTasks() {
  const navigate = useNavigate();
  const credentialGetter = useCredentialGetter();

  const { data: tasks } = useQuery<Array<TaskApiResponse>>({
    queryKey: ["tasks", "queued"],
    queryFn: async () => {
      const client = await getClient(credentialGetter);
      return client
        .get("/tasks", {
          params: {
            task_status: "queued",
          },
        })
        .then((response) => response.data);
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">ID</TableHead>
            <TableHead className="w-1/4">URL</TableHead>
            <TableHead className="w-1/4">Status</TableHead>
            <TableHead className="w-1/4">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>No queued tasks</TableCell>
            </TableRow>
          ) : (
            tasks?.map((task) => {
              return (
                <TableRow
                  key={task.task_id}
                  className="w-4"
                  onClick={() => {
                    navigate(task.task_id);
                  }}
                >
                  <TableCell className="w-1/4">{task.task_id}</TableCell>
                  <TableCell className="w-1/4 max-w-64 overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {task.request.url}
                  </TableCell>
                  <TableCell className="w-1/4">
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="w-1/4">
                    {basicTimeFormat(task.created_at)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export { QueuedTasks };
