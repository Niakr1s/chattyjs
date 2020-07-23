import IEvent from "./IEvent";
import User from "../models/User";

class LoginEvt implements IEvent {
    public static readonly eventName = 'login'

    constructor(public readonly user: User) {}

    type(): string {
        return LoginEvt.eventName;
    }
}

export default LoginEvt