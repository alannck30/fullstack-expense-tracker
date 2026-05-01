import SignUpPage from "@/pages/SignUpPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
  context: () => ({
    title: "SignUp - PennyWise",
  }),
});
