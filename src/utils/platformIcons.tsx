import { SiPlaystation, SiApple, SiAndroid, SiSteam } from "react-icons/si";
import { FaWindows, FaLinux } from "react-icons/fa";
import { MdDevicesOther } from "react-icons/md";
import { IoLogoXbox } from "react-icons/io5";
import { BsNintendoSwitch } from "react-icons/bs";
import type { JSX } from "react";

export const getPlatformIcon = (slug: string): JSX.Element => {
  const map: Record<string, JSX.Element> = {
    pc: <FaWindows />,
    playstation: <SiPlaystation />,
    xbox: <IoLogoXbox />,
    nintendo: <BsNintendoSwitch />,
    mac: <SiApple />,
    linux: <FaLinux />,
    android: <SiAndroid />,
    ios: <SiApple />,
    web: <SiSteam />,
  };

  return map[slug.toLowerCase()] ?? <MdDevicesOther />;
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return "#4caf50";
  if (rating >= 4.0) return "#c9a84c";
  if (rating >= 3.0) return "#ff9800";
  return "#ef5350";
};

export const getMetacriticColor = (score: number): string => {
  if (score >= 75) return "#4caf50";
  if (score >= 50) return "#ff9800";
  return "#ef5350";
};
