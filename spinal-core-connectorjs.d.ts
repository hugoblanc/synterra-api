declare module 'spinal-core-connectorjs' {
  export class Model {
    _attribute_names: [];
    model_id;
    _processes: [];
    _parents: [];
    _date_last_modification;

    has_been_modified(): boolean;
    has_been_directly_modified(): boolean;

    bind(callback: () => any): any;
    unbind(callback: () => any): any;

    get(): any;
    get_state(): any;
    add_attr(attr: any): any;
    rem_attr(): any;
    mod_attr(): any;
    set_attr(): any;
  }

  // interface BarChartProps {
  //   data: BarChartData[];
  //   width?: number;
  //   margin?: MarginValues;
  // }

  // export interface BarChartData {
  //   label: string;
  //   values: BarChartValue | BarChartValue[];
  // }

  // export interface BarChartValue {
  //   x: string;
  //   y: number;
  // }

  // export interface MarginValues {
  //   top?: number;
  //   bottom?: number;
  //   left?: number;
  //   right?: number;
  // }
}
