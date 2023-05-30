import { useAppSelector } from "../../../redux/hooks";
import { selectLocalServers } from "../../../redux/slices/localServers";
import { LocalServerBlockLayout } from "./LocalServerBlockLayout";

export function LocalServerBlock() {
  const localServers = useAppSelector(selectLocalServers);

  return <LocalServerBlockLayout servers={localServers} />;
}