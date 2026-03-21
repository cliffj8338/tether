import React from "react";
import Svg, { Circle, Rect } from "react-native-svg";

interface TetherMarkProps {
  size?: number;
  color?: string;
  endpointOpacity?: number;
}

export function TetherMark({ size = 48, color = "#6B9E8A", endpointOpacity = 0.55 }: TetherMarkProps) {
  const centerR = size * 0.13;
  const spokeWidth = size * 0.055;
  const spokeLength = size * 0.36;
  const gap = size * 0.15;
  const endpointR = size * 0.055;
  const cx = size / 2;
  const cy = size / 2;

  const spokeStart = centerR + gap;
  const spokeEnd = spokeStart + spokeLength;
  const endpointCenter = spokeEnd;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cx} cy={cy} r={centerR} fill={color} />

      <Rect
        x={cx - spokeWidth / 2}
        y={cy - spokeEnd}
        width={spokeWidth}
        height={spokeLength}
        rx={spokeWidth / 2}
        fill={color}
      />
      <Circle cx={cx} cy={cy - endpointCenter} r={endpointR} fill={color} opacity={endpointOpacity} />

      <Rect
        x={cx - spokeWidth / 2}
        y={cy + spokeStart - spokeLength + spokeLength}
        width={spokeWidth}
        height={spokeLength}
        rx={spokeWidth / 2}
        fill={color}
      />
      <Circle cx={cx} cy={cy + endpointCenter} r={endpointR} fill={color} opacity={endpointOpacity} />

      <Rect
        x={cx - spokeEnd}
        y={cy - spokeWidth / 2}
        width={spokeLength}
        height={spokeWidth}
        rx={spokeWidth / 2}
        fill={color}
      />
      <Circle cx={cx - endpointCenter} cy={cy} r={endpointR} fill={color} opacity={endpointOpacity} />

      <Rect
        x={cx + spokeStart - spokeLength + spokeLength}
        y={cy - spokeWidth / 2}
        width={spokeLength}
        height={spokeWidth}
        rx={spokeWidth / 2}
        fill={color}
      />
      <Circle cx={cx + endpointCenter} cy={cy} r={endpointR} fill={color} opacity={endpointOpacity} />
    </Svg>
  );
}
