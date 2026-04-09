import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";   

const client = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("#root element not found");

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);