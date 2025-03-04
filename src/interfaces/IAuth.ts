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
    /**
     * Represents an interface element that may contain basic user information
     * such as name, surname, and photo, or it may be empty.
     *
     * @update by Ricardo Medina on 03/03/2025
     * */
    user: {
        name: string;
        last_name: string;
        photo: string;
    } | {};
}