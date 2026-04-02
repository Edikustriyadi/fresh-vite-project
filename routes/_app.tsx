import { define } from "../utils.ts";
import Navbar from "@/components/Navbar.tsx";

export default define.page(function App({ Component }) {
  return (
    <html data-theme="cupcake">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh-vite-project</title>
      </head>
      <body>
        <Navbar />
        <Component />
      </body>
    </html>
  );
});
