import React from "react";
import { Tooltip } from "../Tooltip";
import "./Label.css";
const getReadableTextColor = (hex: string): string => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // 相対輝度（luminance）を計算
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "000000" : "ffffff";
};

export const Label: React.FC<{
  url: string;
  color: string;
  description: string | null;
  name: string;
}> = ({ url, color, description, name }) => {
  const bgColor = `#${color}`;
  const textColor = `#${getReadableTextColor(color)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="label"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      onMouseEnter={() => {
        console.log("Show label description:", description);
      }}
    >
      {description ? (
        <Tooltip message={description}>
          <span className="label-name">{name}</span>
        </Tooltip>
      ) : (
        <span className="label-name">{name}</span>
      )}
    </a>
  );
};
