export interface IRequest<TResult, TParams> {
  readonly __rpc: string
  readonly __result?: TResult
  readonly params: TParams
}

export type RequestHandler = (request: IRequest<unknown, unknown>) => unknown | Promise<unknown>

export type RequestHandlers = Record<string, RequestHandler>

export const createQueryType = (rpc: string) =>
  <TResult, TParams = void>() =>
    class implements IRequest<TResult, TParams> {
      readonly __rpc = rpc
      readonly __result?: TResult
      readonly params: TParams

      constructor(...[params]: TParams extends void ? [] : [TParams]) {
        this.params = params as TParams
      }
    }

export const createCommandType = (rpc: string) =>
  <TResult = void, TParams = void>() =>
    createQueryType(rpc)<TResult, TParams>()

export const createDispatcher = (handlers: RequestHandlers) => ({
  dispatch: async <TResult, TParams>(request: IRequest<TResult, TParams>) => {
    const handler = handlers[request.__rpc]

    if (!handler) {
      throw new Error(`Unsupported request ${request.__rpc}`)
    }

    return await handler(request) as TResult
  }
})
