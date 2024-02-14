export type AdminUserOperation = AdminSetUserPassword | AdminUpdateUser;

export interface AdminSetUserPassword {
    operation: 'SetUserPassword';
    password: string;
}

export interface AdminUpdateUser {
    operation: 'UpdateMetadata';
    pushNotificationToken?: string;
    phone?: string
    age?: number
}