export interface IRepository<T> {
    create(obj: T, responsibleId: string): Promise<T>;

    delete(id: string): Promise<T | null>;

    find(): Promise<T[]>;

    findById(id: string): Promise<T | null>;

    update(id: string, obj: T): Promise<T | null>;
}
