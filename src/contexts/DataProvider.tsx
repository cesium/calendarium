"use client";
import { createContext, useContext } from "react";
import { IFilterDTO, IShiftDTO } from "../dtos";

interface DataContextType {
  filters: IFilterDTO[];
  shifts: IShiftDTO[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: React.ReactNode;
  filters: IFilterDTO[];
  shifts: IShiftDTO[];
}

export function DataProvider({ children, filters, shifts }: DataProviderProps) {
  return (
    <DataContext.Provider value={{ filters, shifts }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
