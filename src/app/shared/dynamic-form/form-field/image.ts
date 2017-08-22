/**
 * Created by lifei on 2017/3/31.
 */
import {FieldBase} from './field-base';

export class Image extends FieldBase<string> {
    controlType = 'image';
    src: string;

    constructor(options: {} = {}) {
        super(options);
        this.src = options['src'] || '';
    }
}