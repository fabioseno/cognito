export type AdminUserOperation = AdminSetUserPassword | AdminUpdateUser;

export interface AdminSetUserPassword {
    operation: 'SetUserPassword';
    password: string;
}

export interface AdminUpdateUser {
    operation: 'UpdateUser';
    pushNotificationToken?: string;
    phone?: string
    age?: number
}