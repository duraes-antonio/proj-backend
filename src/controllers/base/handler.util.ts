import { Response } from 'express';

const _handlerResponse = async (resFail: Response, fnResSuccess: () => Promise<Response>): Promise<Response> => {
    try {
        return await fnResSuccess();
    } catch (err) {
        return resFail.status(err.code ?? 500).send(err.messages ?? err.message);
    }
};

export const handlerUtil = {
    handlerErrorRequest: _handlerResponse
};
