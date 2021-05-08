export interface SpinalInterface {
  bind: (callback: () => void) => void;
  addAttr: (data: any) => void;
  add_attr: (key: string, value: any) => void;
}
