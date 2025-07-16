import { Clerk } from "https://esm.sh/@clerk/clerk-js@4";

const clerk = new Clerk(
  "pk_test_dXB3YXJkLXNxdWlycmVsLTg4LmNsZXJrLmFjY291bnRzLmRldiQ"
);

await clerk.load();

clerk.mountSignIn({
  node: document.getElementById("auth-root"),
  redirectUrl: window.location.href,
});

clerk.addListener(({ session }) => {
  if (session) {
    session.getToken().then((token) => {
      console.log("✅ Got token", token);
      window.opener.postMessage({ type: "CLERK_TOKEN", token }, "*");
    });
  }
});
