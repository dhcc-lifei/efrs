/**
 * Created by lifei on 2017/3/16.
 */
import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {TranslateModule} from "ng2-translate";

import {ModalModule} from "ng2-bootstrap";

import {
  InputTextModule,
	InputTextareaModule,
    DropdownModule,
    CalendarModule,
	ButtonModule,
	DataTableModule,
	PanelModule,
	TabViewModule,
	DialogModule,
	ConfirmDialogModule,
    MessagesModule,
    GrowlModule,
    SharedModule,
    ConfirmationService
} from "primeng/primeng";

import {CrudComponent} from './crud.component';
import {CrudService} from './services';
import {DictPipe, DropdownPipe} from './pipes';

@NgModule({
    declarations: [
        DictPipe,
        DropdownPipe,
        CrudComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        DataTableModule,
        PanelModule,
        TabViewModule,
        DialogModule,
        ConfirmDialogModule,
        MessagesModule,
        GrowlModule,
        SharedModule,
        ModalModule.forRoot()
    ],
    exports: [
        DictPipe,
        DropdownPipe,
        CrudComponent,
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        ButtonModule,
        DataTableModule,
        PanelModule,
        TabViewModule,
        DialogModule,
        ConfirmDialogModule,
        MessagesModule,
        GrowlModule,
        SharedModule,
        ModalModule
    ]
})
export class CrudModule {
    static forRoot(): ModuleWithProviders {
        return <ModuleWithProviders> {
            ngModule: CrudModule,
            providers: [
                CrudService,
                ConfirmationService
            ]
        }
    }

}
