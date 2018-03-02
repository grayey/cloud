import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ValidateHashModule } from "./validate-hash.module";
import { NotificationModule } from "./notification.module";
// import {CartSlotsComponent} from "../components/cart-slots/cart-slots.component";
declare const CartSlotsComponent;
@NgModule({
    imports: [
        CommonModule,
        // NgbModule,
        FormsModule,
        ReactiveFormsModule,
        ValidateHashModule,
        NotificationModule,
    ],
    declarations: [
        CartSlotsComponent
    ],
    exports: [
        CartSlotsComponent
    ]
})
export class SharedModule { }
