/**
 * Created by lifei on 2017/4/20.
 */
import {Type} from '../enums';

export interface GrowlArgs {
    type?:string | Type;     // 语义样式类型，success/info/warn/error，默认：info
    title?:string | number;  // 标题，默认：消息
    message?:string          // 消息内容
    sticky?:boolean;         // 是否永久显示，默认：false
    life?:number;            // 显示时间，默认：3000ms
    style?:string;           // 自定义内联样式
    styleClass?:string;      // 自定义
}