export interface IUser {
    id_user: string;
    first_name: string;
    second_name: string;
    first_surname: string;
    second_surname: string;
    email: string;
    phone: string;
    password: string;
    photo: string;
    created_at: Date;
    updated_at: Date;
    is_verified: boolean;
}

export interface ResponseUser {
    status: number;
    token?: string;
    refreshToken?: string;
    message: string;
    user: {
        name: string;
        last_name: string;
        photo: string;
    } | {};
}

export interface IJwtPlayLoad {
    id: string;
    email: string;
    phone: string;
    create: Date;
    updated: Date;
}