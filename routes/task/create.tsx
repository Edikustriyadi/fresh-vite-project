import { define } from "../../utils.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();

    const title = form.get("title")?.toString() || "";
    const description = form.get("description")?.toString() || "";
    const completed = form.get("completed") === "on";

    // 🚀 kirim ke backend Hono
    await fetch(`${Deno.env.get("API_URL")}/task/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        completed,
      }),
    });
    // 🔄 redirect balik ke list
    return Response.redirect(new URL("/", ctx.url), 303);
  },
});

export default define.page(function CreateTaskPage() {
  return (
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">➕ Create Task</h1>

      <form method="POST" class="space-y-4">
        {/* Title */}
        <div>
          <label class="label">Title</label>
          <input
            type="text"
            name="title"
            class="input input-bordered w-full"
            placeholder="Enter title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label class="label">Description</label>
          <textarea
            name="description"
            class="textarea textarea-bordered w-full"
            placeholder="Enter description"
          />
        </div>

        {/* Completed */}
        <div class="flex items-center gap-2">
          <input type="checkbox" name="completed" class="checkbox" />
          <span>Completed</span>
        </div>

        {/* Actions */}
        <div class="flex gap-2">
          <button type="submit" class="btn btn-primary">Save</button>
          <a href="/" class="btn btn-outline">Cancel</a>
        </div>
      </form>
    </div>
  );
});
