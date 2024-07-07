interface LayoutProps {
  closeLayerOnClick?: () => void;
  classes?: string;
  bgColor?: string;
}

interface Position {
  x: number;
  y: number;
}

export type { LayoutProps, Position };
