/**
 * Created by lifei on 2017/4/20.
 */
import {NgModule} from '@angular/core';

import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './services';

@NgModule({
    imports: [InMemoryWebApiModule.forRoot(InMemoryDataService)]
})
export class InMemoryDataModule { }