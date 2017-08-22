import {FieldBase} from './field-base';

export class Select extends FieldBase<String> {
  controlType = 'select';
  option: any[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.option = options['option'] || [];
  }
}
