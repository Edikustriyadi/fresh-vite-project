import { define } from "@/utils.ts";
import { Head } from "fresh/runtime";

export default define.page(() => {
  return (
    <div>
      <Head>
        <title>About - Fresh Application</title>
      </Head>
      <div class="p-4">
        <h1 class="text-red-500 text-2xl font-bold mb-4">
          About This Application
        </h1>
        <p class="mb-2">
          This is a sample application built using Deno and Fresh. It
          demonstrates how to create a simple web page with routing and styling.
        </p>
        <p>
          The application is designed to be lightweight and fast, leveraging the
          capabilities of Deno for server-side rendering and Fresh for
          client-side interactivity.
        </p>
      </div>
    </div>
  );
});
