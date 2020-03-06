export interface IRepository<T> {
    create(obj: T): Promise<T>;

    delete(id: string): Promise<T | null>;

    find(params?: any): Promise<T[]>;

    findById(id: string): Promise<T | null>;

    update(id: string, obj: T): Promise<T | null>;
}
