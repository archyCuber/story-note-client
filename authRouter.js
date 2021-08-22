const Router = require('express')
const controller = require('./controllers/UserController')
const {check} = require('express-validator')
const authMiddleWare = require('./middlewares/auth-middleware')

const router = new Router()

router.post('/registration', [
    check('username', 'Имя пользователя должно быть заполнено').notEmpty(),
    check('password',  'Пароль должен быть больше 5 символов, но меньше 12').isLength({min: 5, max: 12})
], controller.registration)
router.post('/login', controller.login)
router.post('/logout', controller.logout)
router.get('/users', controller.getUsers)
router.get('/create', controller.createRoles)
router.get('/refresh', controller.refresh)
router.get('/user', authMiddleWare, controller.getUsers)

module.exports = router