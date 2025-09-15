interface Window {
  ethereum?: {
    request: (...args: any[]) => Promise<any>;
  };
}
