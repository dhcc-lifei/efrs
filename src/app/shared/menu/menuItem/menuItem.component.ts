/**
 * Created by lifei on 2017/2/28.
 */
import {Component, Input} from '@angular/core';

@Component({
    selector: 'menu-item',
    templateUrl: './menuItem.component.html'
})
export class MenuItemComponent {
    @Input() menuItem:any;
}