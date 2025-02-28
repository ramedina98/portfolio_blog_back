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
}

export interface ResponseUser {
    status: number,
    message: string;
    user: IUser | {};
}