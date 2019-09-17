export interface PackagesGetterProgressInfo {
  packages: PackagesGetterProgressPackagesInfo;
  pages: PackagesGetterProgressPagesInfo;
  speedInBytesPerSec: number;
}

export interface PackagesGetterProgressPackagesInfo {
  downloaded: number;
  total: number;
}

export interface PackagesGetterProgressPagesInfo {
  currentNum: number;
  total: number;
}
