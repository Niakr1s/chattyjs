class EmitResult {
    public readonly error: boolean
    constructor(public readonly cause: string = '') {
        this.error = cause !== ''
    }
}

export default EmitResult