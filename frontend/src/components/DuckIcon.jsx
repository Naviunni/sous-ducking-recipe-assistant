import React from "react";
import { SvgIcon } from "@mui/material";

export default function DuckIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 70 70">
      {/* Duck head */}
      <circle cx="35" cy="35" r="25" fill="#FFD966" />
      <circle cx="28" cy="30" r="4" fill="#000" />
      <circle cx="42" cy="30" r="4" fill="#000" />
      <ellipse cx="35" cy="45" rx="12" ry="6" fill="#FF8A00" />
    </SvgIcon>
  );
}
