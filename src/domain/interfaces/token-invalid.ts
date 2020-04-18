'use strict';
import { Registable } from './auditable';

export interface TokenInvalid extends Registable {
    readonly token: string;
    readonly userId: string;
}
