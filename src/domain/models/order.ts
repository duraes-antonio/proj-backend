// 'use strict';
// import { Address } from './address';
// import { ItemOrder } from './itemOrder';
// import { EStateOrder } from '../enum/stateOrder';
// import { DeliveryOption } from './deliveryOption';
//
// export class Order {
//     readonly id: number;
//     readonly items: ItemOrder[];
//     readonly date: Date;
//     readonly state: EStateOrder;
//
//     readonly costDelivery: number;
//     readonly daysForDelivery: number;
//     readonly addressTarget: Address;
//     readonly dateDelivery?: Date;
//
//     constructor(
//       id: number = 0, items: ItemOrder[], date: Date, state: EStateOrder,
//       delivery: DeliveryOption, address: Address, dateDelivery?: Date
//     ) {
//         this.id = id;
//         this.items = items;
//         this.date = date;
//         this.state = state;
//         this.costDelivery = delivery.cost;
//         this.daysForDelivery = delivery.timeDays;
//         this.addressTarget = address;
//         this.dateDelivery = dateDelivery;
//     }
// }
