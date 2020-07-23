import express from "express";
import cors from "cors";
import path from "path";

const DEV = !!process.env.DEV

class ExpressApp {
    private readonly _app: express.Express = express();

    constructor() {
        this.initMiddleware()
        this.initMiddlewareProd()
        this.initHandlers()
        this.initHandlersProd()
    }

    public get app() {
        return this._app
}

    private initMiddleware = () => {
        this._app.use(cors({origin: "http://localhost:3000", credentials: true}))
    }

    private initMiddlewareProd = () => {
        if (!DEV) { this._app.use(express.static(path.join(process.cwd(), 'static')))}
    }

    private initHandlers = () => {
        this._app.get('/api', (req, res) => {
            res.end('Hello, world')
        })
    }

    private initHandlersProd = () => {
        if (!DEV) { this._app.get('*', (req, res) => { res.sendFile(path.join(process.cwd(), 'static/index.html')) })}
    }
}

export default ExpressApp