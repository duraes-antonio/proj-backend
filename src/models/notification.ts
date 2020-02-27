'use strict';
import { TypeNotification } from '../enum/typeNotification';

export class NotificationModel {
	readonly id: number;
	readonly text: string;
	readonly date: Date;
	readonly type: TypeNotification;
	readonly classIcon: string;
	readonly url: string;
	private readonly mapIconNotif = {
		[TypeNotification.PASSWORD_UPDATED]: 'fas fa-key',
		[TypeNotification.ORDER_ON_DELIVERY]: 'fas fa-shipping-fast',
		[TypeNotification.ORDER_DELIVERED]: 'fas fa-gift',
		[TypeNotification.ORDER_PREPARED]: 'fas fa-dolly',
		[TypeNotification.QUESTION_ANSWERED]: 'fas fa-comments',
		[TypeNotification.PAYMENT_CONFIRMED]: 'fas fa-hand-holding-usd',
		[TypeNotification.PAYMENT_RETURNED]: 'fas fa-piggy-bank',
		[TypeNotification.PAYMENT_PENDENT]: 'fas fa-search-dollar'
	};

	// TODO: Alterar o ID para vir do banco
	constructor(id: number, text: string, date: Date, url: string, type: TypeNotification
	) {
		this.id = id;
		this.text = text;
		this.date = date;
		this.url = url;
		this.type = type;
		this.classIcon = this.mapIconNotif[type];
	}

	private _read = false;

	get read(): boolean {
		return this._read;
	}

	set read(value: boolean) {
		this._read = value;

		if (value) {
			this._dateRead = new Date();
		}
	}

	private _dateRead = new Date();

	get dateRead(): Date | null {
		return this.read ? this._dateRead : null;
	}

	toggle() {
		this.read = !this.read;
	}
}
