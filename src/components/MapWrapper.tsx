import { ReactNode, useState } from 'react';

interface MapProps {
  children: ReactNode
}

interface MapWrapperProps {
  mobileMap: ReactNode;
  desktopMap: ReactNode;
  isMobile: boolean;
}

const MobileMap = ({ children }: MapProps) => {
  return <>{children}</>;
};

const DesktopMap = ({ children }: MapProps) => {
  return <>{children}</>;
};

export const MapWrapper = ({ mobileMap, desktopMap, isMobile }: MapWrapperProps) => {
  const zoomMinValue = 1;
  const zoomMaxValue = 6;
  const zoomStep = 0.05;

  const [zoom, setZoom] = useState(zoomMinValue);
  const [panning, setPanning] = useState(false);
  const [pointX, setPointX] = useState(0);
  const [pointY, setPointY] = useState(0);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && zoom < zoomMaxValue) {
      setZoom(zoom + zoomStep);
    } else if (e.deltaY < 0 && zoom > zoomMinValue) {
      setZoom(zoom - zoomStep);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPos({ x: e.clientX - pointX, y: e.clientY - pointY });
    setPanning(true);
  };

  const handleMouseUp = () => {
    setPanning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!panning) return;
    setPointX(e.clientX - startPos.x);
    setPointY(e.clientY - startPos.y);
  };

  return (
    <div
      className="map-wrapper flex w-full md:w-4/5 h-full lg:h-3/4 justify-center items-center"
      onWheel={handleScroll}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {isMobile && <MobileMap>{mobileMap}</MobileMap>}
      {!isMobile && (
        <div
          className="zoom-component cursor-grab"
          style={{
            transform: `translate(${pointX}px, ${pointY}px) scale(${zoom}) `,
          }}
        >
          <DesktopMap>{desktopMap}</DesktopMap>
        </div>
      )}
    </div>
  );
};

