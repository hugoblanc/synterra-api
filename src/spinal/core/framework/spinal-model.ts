export interface SpinalInterface {
  bind: (callback: () => void) => void;
  addAttr: (data: any) => void;
}
