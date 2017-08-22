//export const NG2:string = "http://192.168.1.155:8082/ng2/";
export const NG2:string = "http://192.168.1.10:8082/ng2/";

export const ASYNC_URLS = {
    "login": "assets/json-data/login-mock.json",
    "logout": null,
    "pubDictApi": "assets/json-data/public-dicts.json",
    "prvDictApi": "assets/json-data/private-dicts.json",
    "province": "assets/json-data/province-mock.json",
    "user.list": NG2 + "dhccApi/user/list",
    "user.save": NG2 + "dhccApi/user/save",
    "user.update": NG2 + "dhccApi/user/update",
    "user.cou": NG2 + "dhccApi/user/saveOrUpdate",
    "user.findById": NG2 + "dhccApi/user/findById",
    "user.delete": NG2 + "dhccApi/user/delete"
};