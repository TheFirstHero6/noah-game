import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="sign-in-container">
      <SignIn />
    </div>
  );
}
