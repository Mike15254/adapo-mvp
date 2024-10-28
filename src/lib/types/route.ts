export interface LayoutConfig {
    showNav: boolean;
    showFooter: boolean;
    showBanner: boolean;
  }
  
  export interface RouteConfig {
    [key: string]: LayoutConfig;
  }