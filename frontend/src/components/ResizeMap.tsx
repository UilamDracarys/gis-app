import { useEffect } from "react";
import { useMap } from "react-leaflet";

const ResizeMap = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300); // match your sidebar animation duration
  }, [isSidebarOpen, map]);

  return null;
};

export default ResizeMap;