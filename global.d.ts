declare class Model {
  _attribute_names: [];
  model_id;
  _processes: [];
  _parents: [];
  _date_last_modification;

  has_been_modified(): boolean;
  has_been_directly_modified(): boolean;

  bind(callback: () => any): any;
  unbind(callback: () => any): any;

  add_attr: (data: any) => void;
  addAttr: (data: any) => void;
  get(): any;
  get_state(): any;
  rem_attr(): any;
  mod_attr(): any;
  set_attr(attr: any): any;
}

declare class Lst<T> extends Model {
  static_length(): number;
  default_value(): number;
  base_type(): number;
  get(): T[];
  size(): number;
  toString(): string;
  equals(lst: Lst<T>): boolean;
  push(value: T): void;
  pop(): T | void;
  clear(): T[];
  unshift(): number;
  shift(): T;
  remove(value: T): boolean;
  remove_ref(value: T): boolean;
  filter(predicate: (value: T) => boolean): T[];
  detect(predicate: (value: T) => boolean): T | void;
  sorted(compareFn?: (a: any, b: any) => number): T[];
  has(predicate: (value: T) => boolean): boolean;
  indexOf(value: T): boolean;
  indexOf_ref(value: T): boolean; // BY ref == pointer
  contains(value: T): boolean;
  contains_ref(value: T): boolean;

  /**
   * Remove if present, add if absent
   * @param value the element to toggle
   * @return True if added, false if removed
   */
  toggle(value: T): boolean;

  /**
   * Remove if present, add if absent
   * @param value the element to toggle
   * @return True if added, false if removed
   */
  toggle_ref(value: T): boolean;

  slice(begin: number): Lst<T>;
  concat(list: Lst<T>): Lst<T>;
  splice(index: number, nb?: number): boolean;
  insert(index: number, list: Lst<T>): T[];
  set_or_push(index: number, value: T): void;
}
