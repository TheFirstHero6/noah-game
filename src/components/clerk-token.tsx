import { useClerk } from "@clerk/nextjs";
export async function Component() {
  const clerk = useClerk();
  const token = await clerk.session?.getToken();
  return console.log(token);
}
