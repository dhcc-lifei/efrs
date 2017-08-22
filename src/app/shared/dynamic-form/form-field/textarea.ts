/**
 * Created by lifei on 2017/3/31.
 */
import {FieldBase} from './field-base';

export class TextArea extends FieldBase<String> {
    controlType = 'textarea';
    rows: number;

    constructor(options: {} = {}) {
        super(options);
        this.rows = options['rows'] || 1;
    }
}