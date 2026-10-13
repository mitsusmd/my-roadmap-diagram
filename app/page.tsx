import roadmap from "@/data/frontend.json";
import Roadmap from "@/components/Roadmap";

export default function Home() {
  return <Roadmap data={roadmap} />;
}
