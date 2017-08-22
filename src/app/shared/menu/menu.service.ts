/**
 * Created by lifei on 2017/2/28.
 */
import {Injectable} from '@angular/core';
import {Router, Routes} from '@angular/router';
import * as _ from 'lodash';

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class MenuService {
    private _menuItems = new BehaviorSubject<any[]>([]);
    private _currentMenuItem = {};

    get menuItems() {
        return this._menuItems;
    }

    set menuItems(value) {
        this._menuItems = value;
    }

    get currentMenuItem() {
        return this._currentMenuItem;
    }

    set currentMenuItem(value) {
        this._currentMenuItem = value;
    }

    constructor(private router:Router) {}

    /**
    * Updates the routes in the menu
    *
    * @param {Routes} routes Type compatible with home.menu.ts
    */
    public updateMenuByRoutes(routes:Routes) {
        let convertedRoutes = this.convertRoutesToMenus(_.cloneDeep(routes));
        this._menuItems.next(convertedRoutes);
    }

    public convertRoutesToMenus(routes:Routes):any[] {
        let items = this.convertArrayToItems(routes);
        return this.skipEmpty(items);
    }

    public getCurrentItem():any {
        return this._currentMenuItem;
    }

    public selectMenuItem(menuItems:any[]):any[] {
        let items = [];
        menuItems.forEach((item) => {
            this.selectItem(item);

            if(item.selected) {
                this._currentMenuItem = item;
            }

            if(item.children && item.children.length > 0) {
                item.children = this.selectMenuItem(item.children);
            }
            items.push(item);
        });
        return items;
    }

    protected skipEmpty(items:any[]):any[] {
        let menu = [];
        items.forEach((item) => {
            let menuItem;
            if(item.skip) {
                if(item.children && item.children.length > 0) {
                    menuItem = item.children;
                }
            } else {
                menuItem = item;
            }

            if(menuItem) {
                menu.push(menuItem);
            }
        });

        return [].concat.apply([], menu);
    }

    protected convertArrayToItems(routes:any[], parent?:any):any[] {
        let items = [];
        routes.forEach((route) => {
            items.push(this.convertObjectToItem(route, parent));
        });
        return items;
    }

    protected convertObjectToItem(object, parent?:any):any {
        let item:any = {};
        if(object.menu) {
            // this is a menu object
            item = object.menu;
            item.route = object;
            delete item.route.menu;
        } else {
            item.route = object;
            item.skip = true;
        }

        // we have to collect all paths to correctly build the url then
        if(Array.isArray(item.route.path)) {
            item.route.paths = item.route.path;
        } else {
            item.route.paths = parent && parent.route && parent.route.paths ? parent.route.paths.slice(0) : ['/'];
            if(!!item.route.path) item.route.paths.push(item.route.path);
        }

        if(object.children && object.children.length > 0) {
            item.children = this.convertArrayToItems(object.children, item);
        }

        let prepared = this.prepareItem(item);

        // if current item is selected or expanded - then parent is expanded too
        // if ((prepared.selected || prepared.expanded) && parent) {
        //     parent.expanded = true;
        // }

        return prepared;
    }

    protected prepareItem(object:any):any {
        if(!object.skip) {
            object.target = object.target || '';
            object.pathMatch = object.pathMatch || 'full';
            return this.selectItem(object);
        }

        return object;
    }

    protected selectItem(object:any):any {
        object.selected = this.router.isActive(this.router.createUrlTree(object.route.paths), object.pathMatch === 'full');
        return object;
    }
 }
