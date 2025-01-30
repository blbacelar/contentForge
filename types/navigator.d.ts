interface NetworkInformation {
  readonly effectiveType?: string;
}

declare interface Navigator {
  readonly connection?: NetworkInformation;
} 