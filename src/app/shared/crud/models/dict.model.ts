/**
 * Created by lifei on 2017/4/18.
 */
export class DictModel {
    private _pubDictKeys:Array<string>;
    private _prvDictKeys:Array<string>;
    private _pubDictCaches: Map<string, Array<any>>;
    private _prvDictCaches:Map<string, Array<any>>;

    get pubDictKeys() {
        return this._pubDictKeys;
    }

    get prvDictKeys() {
        return this._prvDictKeys;
    }

    get pubDictCaches() {
        return this._pubDictCaches;
    }

    get prvDictCaches() {
        return this._prvDictCaches;
    }

    constructor() {
        this._pubDictKeys = new Array<string>();
        this._prvDictKeys = new Array<string>();
        this._pubDictCaches = new Map<string, Array<any>>();
        this._prvDictCaches = new Map<string, Array<any>>();
    }
}