export interface TestObject<T> {
    data: T;
    expectStatus: number;
    message: string;
}
