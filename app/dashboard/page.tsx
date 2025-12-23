import { getUser } from "@/actions/auth";

export default async function Page() {
  const { data, error } = await getUser();

  if (error || !data?.user) {
    return <div>Default Dashboard - Please log in</div>;
  }
  return <div>Default Dashboard {JSON.stringify(data.user.email)}</div>;
}
