import { useContext } from "react"
import { DataContext } from "../context/data"

export const useData = () => {
  return useContext( DataContext )
}
