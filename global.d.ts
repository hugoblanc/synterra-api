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
  set_attr(): any;
}
