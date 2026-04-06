import { getActiveSubsidiesAsync, getDeadlineSubsidiesAsync } from "@/lib/subsidies";
import HomeClient from "./HomeClient";

export const revalidate = 21600;

export default async function LandingPage() {
  const [active, deadline] = await Promise.all([
    getActiveSubsidiesAsync(),
    getDeadlineSubsidiesAsync(7),
  ]);

  return <HomeClient activeCount={active.length} deadlineSubsidies={deadline} />;
}
