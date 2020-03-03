export interface IAuditable {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly responsibleId: string;
}

export class IClassAuditable implements IAuditable {
    readonly createdAt: Date = new Date;
    readonly updatedAt: Date = new Date();
    readonly responsibleId: string = '';

}
