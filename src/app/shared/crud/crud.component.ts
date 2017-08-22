/**
 * Created by lifei on 2017/4/5.
 */
import {Component, Input, OnInit, AfterViewInit} from '@angular/core';

import {ConfirmationService} from 'primeng/primeng';

import {Type} from './enums';
import {DataTableArgs, ConfirmArgs} from './interfaces';
import {DataTable, Growl} from './events';
import {CrudService} from './services';

@Component({
    selector: 'shared-crud',
    templateUrl: './crud.component.html'
})
export class CrudComponent implements OnInit, AfterViewInit {
    @Input() dictRequest:boolean = true;

    public pubDicts:Map<string, Array<any>>;  // 公共字典，用于字典管道数据变更检测
    public prvDicts:Map<string, Array<any>>;  // 自定义字典，用于字典管道数据变更检测
    public zh = {                             // 日期时间组件国际化配置
        firstDayOfWeek: 0,
        dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    };
    public growl:Growl;   // 消息提示

    constructor(protected crudService:CrudService, private confirmService?:ConfirmationService) {
        if (confirmService) {
            crudService.confirmService = confirmService;
        }
        this.growl = Growl.Instance;
    }

    // 创建数据表格类实例
    protected dataTable(args:DataTableArgs):DataTable {
        if (args && args.url) {
            // 创建DataTable实例，实例内封装dataTable事件
            let dataTable:DataTable = new DataTable(args, this.crudService);
            // DataTable实例对应数据列表的模糊查询输入框响应式事件
            args.searchTextStream
                .debounceTime(args.debounceTime)
                .distinctUntilChanged()
                .subscribe(searchText => {
                    dataTable.init();
                });
            return dataTable;
        } else {
            return null;
        }
    }

    // 新增数据
    save(dataTable:DataTable, object:any) {
        if (!dataTable) {
            this.growl.show({type:Type.error, message:'表格实例对象不能为空！'});
            return;
        }

        dataTable.form.save(object).subscribe(
            res => {
                let msg = res.msg ? res.msg : (res.operateSuccess||res.opreatSuccess) ? '数据保存成功！' : '数据保存失败！';
                if (res.operateSuccess||res.opreatSuccess) {
                    this.growl.show({message:msg});
                    dataTable.refresh();
                } else {
                    this.growl.show({type:Type.error,message:msg});
                }
            }
        );
    }

    // 更新数据
    update(dataTable:DataTable, object:any) {
        if (!dataTable) {
            this.growl.show({type:Type.warn,message:'当前操作的数据表格不存在，请检查配置！'});
            return;
        }

        dataTable.form.update(object).subscribe(
            res => {
                let msg = res.msg ? res.msg : (res.operateSuccess||res.opreatSuccess) ? '数据更新成功！' : '数据更新失败！';
                if (res.operateSuccess||res.opreatSuccess) {
                    this.growl.show({message:msg});
                    dataTable.refresh();
                } else {
                    this.growl.show({type:Type.error,message:msg});
                }
            }
        );
    }

    // 新增或更新数据
    saveOrUpdate(dataTable:DataTable, object:any) {
        if (!dataTable) {
            this.growl.show({type:Type.warn,message:'表格实例对象不能为空！'});
            return;
        }

        dataTable.form.saveOrUpdate(object).subscribe(
            res => {
                let msg = res.msg ? res.msg : (res.operateSuccess||res.opreatSuccess) ? '数据提交成功！' : '数据提交失败！';
                if (res.operateSuccess||res.opreatSuccess) {
                    this.growl.show({message:msg});
                    dataTable.refresh();
                } else {
                    this.growl.show({type:Type.error,message:msg});
                }
            }
        );
    }

    // 根据ID查询数据
    findById(dataTable:DataTable, object:any, callback?:Function) {
        if (!dataTable) {
            this.growl.show({type:Type.warn,message:'当前操作的数据表格不存在，请检查配置！'});
            return;
        }

        dataTable.form.findById(object).subscribe({
            next:res => {
                if (callback) {
                    callback(res);
                }
                // if (res.operateSuccess||res.opreatSuccess) {
                //     dataTable.args.formArgs.entity = res;

                //     if (callback) {
                //         callback(res);
                //     }
                // } else {
                //     let msg = res.msg || '数据查询失败！';
                //     this._growl.show({type:'warn',message:msg});
                // }
            }
        });
    }

    // 删除数据
    delete(dataTable:DataTable, object:any) {
        if (!dataTable) {
            this.growl.show({type:Type.warn,message:'当前操作的数据表格不存在，请检查配置！'});
            return;
        }

        dataTable.form.delete(object).subscribe(
            res => {
                let msg = res.msg ? res.msg : (res.operateSuccess||res.opreatSuccess) ? '删除成功！' : '删除失败！';
                if (res.operateSuccess||res.opreatSuccess) {
                    this.growl.show({message:msg});
                    dataTable.refresh();
                } else {
                    this.growl.show({type:Type.error,message:msg});
                }
            }
        );
    }

    //确认上传文件
    upload(dataTable:DataTable,object:any):void{
      /*console.log(file);*/
      if (!dataTable) {
        this.growl.show({type:Type.warn,message:'当前操作的数据表格不存在，请检查配置！'});
        return;
      }

      dataTable.form.upload(object).subscribe(
        res => {
          let msg = res.msg ? res.msg : res.opreatSuccess ? '上传成功！' : '上传失败！';
          if (res.opreatSuccess) {
            this.growl.show({message:msg});
            dataTable.refresh();
          } else {
            this.growl.show({type:'error',message:msg});
          }
        }
      );
    }

    // 删除数据对话框
    confirm(args:ConfirmArgs) {
        let title = args.title || '请确认',
            msg = args.message || '您确认要删除该条数据吗?',
            icon = args.icon || 'fa fa-question-circle';

        this.crudService.confirmService.confirm({
            message: msg,
            header: title,
            icon: icon,
            accept: () => {
                if (!args.params) {
                    this.growl.show({type:Type.warn, message:'参数params不能为空！'});
                    return;
                }
                if (!args.method) {
                    args.method = 'delete';
                }

                if (args.dataTable) {
                    this[args.method](args.dataTable, args.params);
                } else if (args.form) {
                    args.form[args.method](args.params).subscribe({
                        next:res => {
                            let msg = res.msg ? res.msg : (res.operateSuccess||res.opreatSuccess) ? '操作成功！' : '操作失败！';
                            if (res.operateSuccess||res.opreatSuccess) {
                                this.growl.show({message:msg});
                            } else {
                                this.growl.show({type:Type.error,message:msg});
                            }
                        }
                    });
                } else {
                    this.growl.show({type:Type.warn, message:'参数params不能为空！'});
                }
            }
        });

    }

    // 显示http请求错误消息
    private showHttpError(err) {
        let errMsg = (err.json()) ? err.json().error :
            err.status ? `${err.status} - ${err.statusText}` : '服务器错误！';

        switch(err.status) {
            case 401:
            case 404:
            case 500:
            case 503:
                //this.confirm({});
                this.growl.show({type:'error', title:err.status, message:err.statusText});
                break;
            case 504:
                if ('overDue' === err.statusText) {
                    this.growl.show({type:'warn', title:'登录过期', message:'请重新登录'});
                } else {
                    this.growl.show({type:'error', title:err.status, message:err.statusText});
                }
                break;
            case 403:
                // if ('UNAUTHORIZED' === error.statusText) {
                //     this.growl.show({type:Type.warn, title:'没有权限', message:'没有该操作相应权限，请检查后再试!'});
                // } else if ('Forbidden' === error.statusText) {
                //     let msg = "访问被拒绝,无访问权限!";
                //     if (error.message) {
                //         msg = error.message;
                //     }
                //     this.growl.show({type:Type.warn, title:'没有权限', message:msg});
                // } else {
                //     this.growl.show({type:Type.error, title:error.status, message:error.statusText})
                // }
                // break;
            case 5004:
                this.growl.show({type:'warn', title:'会话超时提示', message:'访问超时，即将退出系统，请重新登录！'});
                setTimeout(() => {
                    //this.router.navigateByUrl("login");
                    window.location.href = this.crudService.asyncUrls['logout'];
                }, 2000);
                break;
            // case 599:
            // case 4003:
            // case 5003:
            // case 5004:
            default:
                this.growl.show({type:'error', title:err.status, message:err.statusText});
                break;
        }
        console.error(err);
	}

    ngOnInit():void { }

    ngAfterViewInit() {
        if (this.dictRequest) {
            this.crudService.batchDicts(() => {
                this.pubDicts = new Map<string, Array<any>>();
                this.prvDicts = new Map<string, Array<any>>();
                this.crudService.dictModel.pubDictKeys.forEach(key => {
                    this.pubDicts.set(key, this.crudService.dictModel.pubDictCaches.get(key));
                });
                this.crudService.dictModel.prvDictKeys.forEach(key => {
                    this.prvDicts.set(key, this.crudService.dictModel.prvDictCaches.get(key));
                });
            });
        }

        this.crudService.httpStatusStream
            .distinctUntilChanged()
            .subscribe(err => {
                this.showHttpError(err);
            });
    }
}
