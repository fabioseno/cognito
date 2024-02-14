import { api } from "./axios.config";

export const CognitoApi = {
    login: function (username: string, password: string) {
        return api.request({
            url: '/login',
            method: 'POST',
            data: {
                username,
                password
            }
        });
    },

    refreshAccessToken: function (refreshToken: string) {
        return api.request({
            url: '/refresh-token',
            method: 'POST',
            data: {
                token: refreshToken
            }
        });
    },

    forgotPassword: function (username: string) {
        return api.request({
            url: '/forgot-password',
            method: 'POST',
            data: {
                username
            }
        });
    },

    changePassword: function (token: string, oldPassword: string, newPassword: string) {
        return api.request({
            url: '/change-password',
            method: 'POST',
            data: {
                token,
                oldPassword,
                newPassword
            }
        });
    }
}