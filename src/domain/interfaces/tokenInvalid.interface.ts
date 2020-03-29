'use strict';
import { Registable } from './auditable.interface';

export interface TokenInvalid extends Registable {
    readonly token: string;
    readonly userId: string;
}
