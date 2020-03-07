export interface IRegistable {
    _id?: any;
    readonly createdAt?: Date;
}

export class IClassAuditable implements IRegistable {
    readonly id: any;
    readonly createdAt: Date = new Date;
}
