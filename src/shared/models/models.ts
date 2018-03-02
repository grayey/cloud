export interface Consumer {
    id: number | string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    enabled: string | boolean;
    created_at: string | Date;
    updated_at: string | Date;
    login: Login;
}

export interface Login {
    id: number | string;
    username: string;
    user_type: string;
    last_logged_in: Date | string;
    status: boolean | string;
    created_at: Date | string;
    updated_at: Date | string;
}

export interface Payload {
    required: boolean;
    type: string;
    label: string;
    className: string;
    name: string;
    style: string;
}
