
export interface ISingleKeyBaseRepository<T> extends IBaseRepository<T> {
    findByPrimaryKey(id: string): Promise<T | null>
    findAll(): Promise<T[]>
}

export interface IMultiKeyBaseRepository<T> extends IBaseRepository<T> {
    findAll(): Promise<T[]>
}

export interface IBaseRepository<T> {
    save(entity: T): Promise<T>

    update(entity: T): Promise<T>
}
