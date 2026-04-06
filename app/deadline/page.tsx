import { getDeadlineSubsidiesAsync } from "@/lib/subsidies";
import DeadlineClient from "./DeadlineClient";

export const revalidate = 21600;

export default async function DeadlinePage() {
  const deadlines = await getDeadlineSubsidiesAsync(30);
  return <DeadlineClient deadlines={deadlines} />;
}
