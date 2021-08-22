module.exports = class UserDto {
    userName;
    roles;
    id;

    constructor(model) {
        console.log('DD model', model)
        this.userName = model.userName
        this.roles = model.roles
        this.id = model._id
    }
}