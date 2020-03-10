import request from '@/utils/request';
import { stringify } from 'qs';

export default class DataDictItemApi {

    static update({ id, ...payload }) {
        return request(`/api/data-dict/item/${id}`, {
            method: 'PUT',
            body: {
                ...payload,
            },
        });
    }

    static insert(payload) {
        return request(`/api/data-dict/item`, {
            method: 'POST',
            body: {
                ...payload,
            },
        });
    }

    static getOne({ id, ...payload }) {
        let queryString = stringify(payload);
        return request(`/api/data-dict/item/${id}?${queryString}`, {
            method: 'GET',
        });
    }

    static deletes(payload) {
        return request(`/api/data-dict/item`, {
            method: 'DELETE',
            body: {
                ...payload,
            },
        });
    }

}
