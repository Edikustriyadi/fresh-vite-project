import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { page } from "fresh";

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();
    const id = form.get("id");
    if (id) {
      await fetch(`${Deno.env.get("API_URL")}/task/${id}`, {
        method: "DELETE",
      });
    }
    return ctx.redirect("/");
  },
  async GET(ctx) {
    // 🚀 fetch data dari backend Hono
    const url = new URL(ctx.url);
    const totalPage = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "5";
    const title = url.searchParams.get("title") || "";
    const endpoint = title
      ? `${
        Deno.env.get("API_URL")
      }/task/search?page=${totalPage}&pageSize=${pageSize}&title=${title}`
      : `${
        Deno.env.get("API_URL")
      }/task?page=${totalPage}&pageSize=${pageSize}`;
    const res = await fetch(endpoint);
    const tasks = await res.json();
    return page({ tasks, totalPage, pageSize, title });
  },
});

export default define.page<typeof handler>(({ data }) => {
  const { tasks, totalPage, pageSize, title } = data;
  return (
    <div class="p-6 max-w-xl mx-auto">
      <Head>
        <title>Task List</title>
      </Head>
      <div class="p-6 max-w-2xl mx-auto">
        <div className="my-2 flex items-center justify-between">
          <h1 class="text-2xl font-bold mb-4">📋 Task List</h1>
          <a href="/task/create" class="btn btn-success">
            + Create Task
          </a>
        </div>
        {/* 🔍 Search */}
        <form method="GET" class="flex gap-2 mb-4">
          <input type="hidden" name="pageSize" value={pageSize} />
          <input
            type="text"
            name="title"
            value={title ?? ""}
            placeholder="Search task..."
            class="input input-bordered w-full"
          />
          <button type="submit" class="btn btn-primary">Search</button>
        </form>

        <div class="space-y-2">
          {tasks.data?.length === 0 && (
            <p class="text-center text-gray-500">No tasks found</p>
          )}

          {tasks.data?.map((task: any) => (
            <div class="card bg-base-100 shadow">
              <div class="card-body p-4">
                <h2 class="card-title">{task.title}</h2>
                <span
                  class={`badge ${
                    task.completed ? "badge-success" : "badge-warning"
                  }`}
                >
                  {task.completed ? "Done" : "Pending"}
                </span>
                <p class="text-sm text-gray-500">
                  {task.description}
                </p>
                <div class="card-actions justify-end">
                  <label
                    for={`modal-${task.id}`}
                    class="btn btn-error btn-sm text-white"
                  >
                    Delete
                  </label>
                </div>
                <input
                  type="checkbox"
                  id={`modal-${task.id}`}
                  class="modal-toggle"
                />

                <div class="modal">
                  <div class="modal-box">
                    <h3 class="font-bold text-lg">Delete Task?</h3>
                    <p class="py-2">
                      Are you sure you want to delete "{task.title}"?
                    </p>

                    <div class="modal-action">
                      {/* ❌ Cancel */}
                      <label for={`modal-${task.id}`} class="btn text-white">
                        Cancel
                      </label>

                      {/* ✅ Confirm Delete */}
                      <form method="POST">
                        <input type="hidden" name="id" value={task.id} />
                        <button type="submit" class="btn btn-error text-white">
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 📄 Pagination */}
      <div class="flex justify-center mt-2">
        <div class="join">
          {/* Prev */}
          <a
            href={`?page=${
              Number(totalPage) - 1
            }&pageSize=${pageSize}&title=${title}`}
            class={`join-item btn ${
              Number(totalPage) <= 1 ? "btn-disabled" : ""
            }`}
          >
            «
          </a>

          {/* Page Numbers */}
          {Array.from({ length: tasks?.totalPages }, (_, i) => (
            <a
              href={`?page=${i + 1}&pageSize=${pageSize}&title=${title}`}
              class={`join-item btn ${
                Number(totalPage) === i + 1 ? "btn-active" : ""
              }`}
            >
              {i + 1}
            </a>
          ))}

          {/* Next */}
          <a
            href={`?page=${
              Number(totalPage) + 1
            }&pageSize=${pageSize}&title=${title}`}
            class={`join-item btn ${
              Number(totalPage) >= tasks?.totalPages ? "btn-disabled" : ""
            }`}
          >
            »
          </a>
        </div>
      </div>

      {/* 📊 Info */}
      <div class="text-center text-sm text-gray-500">
        Total: {tasks?.total} • Pages: {tasks?.totalPages}
      </div>
    </div>
  );
});
