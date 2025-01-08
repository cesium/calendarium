import { createContext, useContext } from "react";
import { IFilterDTO, ISelectedFilterDTO } from "../dtos";

interface AppInfoContextData {
  isEvents: boolean;
  filters: number[] | IFilterDTO[];
  handleFilters: (filters: number[] | ISelectedFilterDTO[]) => void;
  fetchTheme: () => void;
  image: string;
  handleData: (_: boolean) => void;
}

const AppContext = createContext<AppInfoContextData | undefined>(undefined);

export function AppInfoProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: AppInfoContextData;
}) {
  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}

export function useAppInfo() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppInfo must be used within a AppInfoProvider");
  }
  return context;
}
