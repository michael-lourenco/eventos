import {
  INavigationService,
  NavigationService,
} from "@/services/navigation/service";
import { useRouter } from "next/navigation";

export const useNavigation = (): INavigationService => {
  const router = useRouter();

  return new NavigationService(router);
};
