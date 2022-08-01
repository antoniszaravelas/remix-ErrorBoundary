import { useSearchParams } from "@remix-run/react";

export default function Status() {
  const [searchParams] = useSearchParams();
  if (searchParams.get("v") === "client" && typeof document !== "undefined") {
    throw new Error("simulated client error");
  }
  return <div>hello</div>;
}
