import React from "react";
import { SvgIcon } from "@mui/material";

export default function ChefIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 64 64">
      <path
        d="M32 10c-7 0-12 5-12 11 0 .7.1 1.4.3 2H16c-2.2 0-4 1.8-4 4v6c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2v-6c0-2.2-1.8-4-4-4h-4.3c.2-.6.3-1.3.3-2 0-6-5-11-12-11z"
        fill="#fff"
      />
      <path
        d="M18 35h28v10c0 1.1-.9 2-2 2H20c-1.1 0-2-.9-2-2V35z"
        fill="#e0e0e0"
      />
    </SvgIcon>
  );
}