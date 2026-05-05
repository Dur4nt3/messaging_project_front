export function get200(body) {
    return {
        ok: true,
        status: 200,
        body,
    };
}

export function get400(body) {
    return {
        ok: true,
        status: 400,
        body,
    };
}

const error401 = {
    ok: true,
    status: 401,
    body: {
        success: false,
        message: 'Could not validate session!',
    },
};

export { error401 };
