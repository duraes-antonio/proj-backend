export interface IRepository<T> {
    create(obj: T): Promise<T>;

    delete(id: string): Promise<T>;

    find(): Promise<T[]>;

    findById(id: string): Promise<T>;

    update(id: string, obj: T): Promise<T>;
}
