import React from "react";

const LoadingSvg = () => {
  const size = 10; // radio del círculo
  const gap = 6;   // separación entre círculos
  const duration = 2; // segundos

  return (
    <svg
      width={size * 6 + gap * 2} // ancho total
      height={size * 3}
      style={{ display: "block", margin: "3rem", background: "#fff" }}
    >
      {/* Círculo 1 */}
      <g transform={`translate(${size}, ${size * 1.5})`}>
        <circle cx={0} cy={0} r={size} fill="#e4b61a">
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;0.3;0.6;1"
            keyTimes="0;0.33;0.66;1"
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Círculo 2 */}
      <g transform={`translate(${size * 3 + gap}, ${size * 1.5})`}>
        <circle cx={0} cy={0} r={size} fill="#e4b61a">
          <animateTransform
            attributeName="transform"
            type="scale"
            values="0.6;1;0.3;0.6"
            keyTimes="0;0.33;0.66;1"
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Círculo 3 */}
      <g transform={`translate(${size * 5 + gap * 2}, ${size * 1.5})`}>
        <circle cx={0} cy={0} r={size} fill="#e4b61a">
          <animateTransform
            attributeName="transform"
            type="scale"
            values="0.3;0.6;1;0.3"
            keyTimes="0;0.33;0.66;1"
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
};

const LogoSvg = ({ size = 70, stroke = 14, color = "#f3c52eff" }) => {
  const radius = size / 2 - stroke / 2;
  const offsetX = size + 20;
  const offsetY = 8;
  const rowOffsetY = size + 20;
  const extraOffset = 10;

  const maxCircleRadius = size / 2;
  const contentWidth = offsetX * 3 + extraOffset + size;
  const contentHeight = rowOffsetY * 3 + size;

  const totalWidth = contentWidth + maxCircleRadius * 2;
  const totalHeight = contentHeight + maxCircleRadius * 2;

  const centerX = totalWidth / 2;
  const centerY = totalHeight / 2;

  const startX = centerX - contentWidth / 2 + radius;
  const startY = centerY - contentHeight / 2 + radius;

  const getLineCoords = (x1, y1, x2, y2, r1 = radius, r2 = radius) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ratio1 = r1 / dist;
    const ratio2 = r2 / dist;
    return {
      x1: x1 + dx * ratio1,
      y1: y1 + dy * ratio1,
      x2: x2 - dx * ratio2,
      y2: y2 - dy * ratio2,
    };
  };

  const line1 = getLineCoords(startX + offsetX, startY, startX, startY + rowOffsetY);
  const line3 = getLineCoords(startX + offsetX, startY, startX + offsetX * 2, startY + rowOffsetY);
  const line4 = getLineCoords(startX + offsetX * 2, startY, startX + offsetX * 3 + extraOffset, startY + rowOffsetY);
  const line5 = getLineCoords(startX + offsetX, startY + rowOffsetY + offsetY, startX, startY + rowOffsetY * 2);
  const line6 = getLineCoords(
    startX + offsetX * 3 + extraOffset,
    startY + rowOffsetY,
    startX + offsetX * 2 + extraOffset,
    startY + rowOffsetY * 2 - offsetY,
    radius,
    radius
  );
  const line7 = getLineCoords(startX, startY + rowOffsetY * 2, startX + offsetX, startY + rowOffsetY * 3);
  const line8 = getLineCoords(
    startX + offsetX + extraOffset,
    startY + rowOffsetY * 2,
    startX + offsetX * 2 + extraOffset,
    startY + rowOffsetY * 3,
    radius,
    radius
  );
  const line9 = getLineCoords(
    startX + offsetX * 3 + extraOffset,
    startY + rowOffsetY * 2,
    startX + offsetX * 2,
    startY + rowOffsetY * 3
  );

  return (
    <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`} xmlns="http://www.w3.org/2000/svg">
      {/* ==== LÍNEAS ==== */}
      <line {...line1} stroke={color} strokeWidth={stroke} />
      <line {...line3} stroke={color} strokeWidth={stroke} />
      <line {...line4} stroke={color} strokeWidth={stroke} />
      <line {...line5} stroke={color} strokeWidth={stroke} />
      <line {...line6} stroke={color} strokeWidth={stroke} />
      <line {...line7} stroke={color} strokeWidth={stroke} />
      <line {...line8} stroke={color} strokeWidth={stroke} />
      <line {...line9} stroke={color} strokeWidth={stroke} />

      {/* ==== CÍRCULOS ==== */}
      <circle cx={startX + offsetX} cy={startY} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX + offsetX * 2 + extraOffset} cy={startY} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX} cy={startY + rowOffsetY} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX + offsetX} cy={startY + rowOffsetY + offsetY} r={size / 2} fill={color} />
      <circle cx={startX + offsetX * 2} cy={startY + rowOffsetY} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX + offsetX * 3 + extraOffset} cy={startY + rowOffsetY} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX} cy={startY + rowOffsetY * 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX + offsetX + extraOffset} cy={startY + rowOffsetY * 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX + offsetX * 2 + extraOffset} cy={startY + rowOffsetY * 2 - offsetY} r={size / 2} fill={color} />
      <circle cx={startX + offsetX * 3 + extraOffset} cy={startY + rowOffsetY * 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX + offsetX} cy={startY + rowOffsetY * 3} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx={startX + offsetX * 2 + extraOffset} cy={startY + rowOffsetY * 3} r={radius} fill="none" stroke={color} strokeWidth={stroke} />
    </svg>
  );
};

const SplashScreen = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <LogoSvg size={70} stroke={14} color="#e4b61a" />
      <LoadingSvg size={10} gap={6} color="#e4b61a" duration={2} />
    </div>
  );
};

export default SplashScreen;
