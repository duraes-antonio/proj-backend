import { DirectionSort } from './repository/order.repository';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _moment = require('moment');

function _buildTextFilter(text?: string): object {
    if (!text || !text.trim()) {
        return {};
    } else {
        return { $text: { $search: text, $caseSensitive: false } };
    }
}

function _buildDateFilter(fieldName: string, dateStart?: Date, dateEnd?: Date): object {

    function setMaxTimeDate(date: Date | string): Date {
        return _moment(date)
          .set('hour', 23)
          .set('minute', 59)
          .set('second', 59)
          .toDate();
    }

    if (dateStart && dateEnd) {
        return {
            $and: [
                { [fieldName]: { $gte: new Date(dateStart) } },
                { [fieldName]: { $lte: setMaxTimeDate(dateEnd) } }
            ]
        };
    } else if (dateStart) {
        return { [fieldName]: { $gte: new Date(dateStart) } };
    } else if (dateEnd) {
        return { [fieldName]: { $lte: setMaxTimeDate(dateEnd) } };
    } else {
        return {};
    }
}

function _buildInArrayFilter(fieldName: string, arrayOptions?: any[]): object {
    return arrayOptions && arrayOptions.length ? { [name]: arrayOptions } : {};
}

function _buildSortParam(fieldName: string, direction: DirectionSort): object {
    return { [fieldName]: direction === DirectionSort.ASCENDING ? 1 : -1 };
}

function _buildSkipParam(perPage?: number, currentPage?: number): number {
    return (perPage && currentPage && perPage > 0 && currentPage > 0) ? perPage * currentPage : 0;
}

function _buildLimitParam(limit?: number): number {
    return (!limit || limit < 1) ? 1000 : limit;
}

function _buildSimpleParam(name: string, value: any): object {
    return value ? { [name]: value } : {};
}


export const mongoQueryUtils = {
    buildTextFilter: _buildTextFilter,
    buildDateFilter: _buildDateFilter,
    buildInArrayFilter: _buildInArrayFilter,
    buildSortParam: _buildSortParam,
    buildSkipParam: _buildSkipParam,
    buildLimitParam: _buildLimitParam,
    buildSimpleParam: _buildSimpleParam
};
