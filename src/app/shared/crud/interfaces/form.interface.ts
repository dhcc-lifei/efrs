/**
 * Created by lifei on 2017/4/12.
 */
interface FormUrlArgs {
    create?:string;      // 新增url
    retrieve?:string;    // 查询url
    update?:string;      // 更新url
    delete?:string;      // 删除url
    cou?:string;         // 新增或更新url
    upload?:string;      // 文件上传
}

export interface FormArgs {
    urls?:FormUrlArgs;   // crud操作urls
    method?:string;      // http请求方式，GET/POST
    entity?:any;         // 存放待提交数据的实体，用于与模版进行数据绑定
    params?:any;         // 请求参数
    key?:string;         // 后台接受参数的属性所在的对象路径
    uploadKey?:string;   // 后台接受file文件的对象路径
}
