export default class SignupError {
    constructor(username, name, password, cpassword) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.cpassword = cpassword;
    }
}