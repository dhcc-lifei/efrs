/**
 * Created by lifei on 2017/4/20.
 */
import {DataTable, Form} from '../events';
// export interface ConfirmArgs {
//     title?:string;         // 标题
//     message?:string;       // 消息内容
//     icon?:string;          // 小图标，请查阅font-awesome
//     acceptLabel?:string;   // 确认按钮标签
//     acceptIcon?:string;    // 确认按钮小图标
//     rejectLabel?:string;   // 取消按钮标签
//     rejectIcon?:string;    // 取消按钮小图标
//     width?:number;         // 确认弹框宽度，默认：300
//     height?:number;        // 确认弹窗高度，默认：auto
// }

export interface ConfirmArgs {
    title?:string;            // 标题
    message?:string;          // 消息内容
    icon?:string;             // 图标
    method?:string;           // accept下执行的函数名称，默认:'delete'
    dataTable?:DataTable;     // 数据表格实例
    form?:Form;               // 表单实例
    params?:any;              // 参数
}