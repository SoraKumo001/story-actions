import * as React from "react";

export const Box: React.FC = ({ children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "640px",
      height: "480px",
      border: "solid 1px",
    }}
  >
    {children}
  </div>
);
