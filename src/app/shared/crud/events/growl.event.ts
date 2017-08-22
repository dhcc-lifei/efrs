/**
 * Created by lifei on 2017/4/20.
 */
import {Message} from 'primeng/primeng';

import {GrowlArgs} from '../interfaces';

export class Growl {
    // 单例模式，构造函数设置为private
    public static readonly Instance:Growl = new Growl();

    msgs:Message[];  // Growl messages
    sticky:boolean;
    life:number;
    style:string;
    styleClass:string;

    private readonly types = ['success', 'info', 'warn', 'error'];

    private constructor() {
        this.msgs = [];
        this.sticky = false;
        this.life = 3000;
    }

    show(args?:GrowlArgs):void {
        this.msgs = [];

        if (!args) {
            args = new Object();
        }
        args.type = args.type ? ((typeof args.type == 'number') ? this.types[args.type] : args.type) : 'success';

        this.sticky = args.sticky || this.sticky;
        this.life = args.life || this.life;
        this.style = args.style;
        this.styleClass = args.styleClass;
        switch(args.type) {
            case 'error':
                args.title = args.title || '错误';
                break;
            case 'warn':
                args.title = args.title || '警告';
                break;
            case 'success':
                args.title = args.title || '成功';
                break;
            default:
                args.title = args.title || '消息';
                break;
        }

        this.msgs.push({severity:args.type, summary:args.title.toString(), detail:args.message});
    }

    hide():void {
        this.msgs = [];
    }

}