/**
 * Created by lifei on 2017/2/28.
 */
import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs/Rx';

import {MenuService} from './menu.service';

@Component({
    selector: 'sidebar-menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent {

    public menuItems:any[];
    protected menuItemsSub: Subscription;
    protected onRouteChange: Subscription;

    constructor(private router:Router, private menuService:MenuService) {}

    public updateMenu(newMenuItems) {
        this.menuItems = newMenuItems;
        this.selectMenuAndNotify();
    }

    public selectMenuAndNotify():void {
        if(this.menuItems) {
            this.menuItems = this.menuService.selectMenuItem(this.menuItems);
        }
    }

    public ngOnInit():void {
        this.onRouteChange = this.router.events.subscribe((event) => {
            if(event instanceof NavigationEnd) {
                if(this.menuItems) {
                    this.selectMenuAndNotify();
                } else {
                    setTimeout(() => this.selectMenuAndNotify());
                }
            }
        });
        this.menuItemsSub = this.menuService.menuItems.subscribe(this.updateMenu.bind(this));
    }

    public ngOnDestroy():void {
        this.onRouteChange.unsubscribe();
        this.menuItemsSub.unsubscribe();
    }
}