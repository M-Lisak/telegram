const TelegramApi = require('node-telegram-bot-api')
const sequelize = require('./db');
const UserModel = require('./models');
const TablesModel = require('./modelsTable')
const { auth_inline, get_report_button } = require('./options');

const token = '5742477796:AAEPuZBxroVV1pI-16NjIqZdYXr2yTed9ps'

const bot = new TelegramApi(token, {polling: true})


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Подключение к бд сломалось', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                const isUserCreate = await UserModel.findOne({ where: { chatId: `${chatId}` } })

                console.log('user', JSON.stringify(isUserCreate, null, '\t'))

                if(!isUserCreate){
                    await bot.sendMessage(chatId, `Добро пожаловать в телеграм бот!`);
                    return bot.sendMessage(chatId, 'Чтобы продолжить работу нужно зарегистрироваться', auth_inline)
                } else {
                    return bot.sendMessage(chatId, `Вы зарегистрированны с API: "${isUserCreate.key_API || ''}"`, get_report_button)
                }

                // return bot.sendMessage(chatId, 'Меню', inline_buttons)
            }
            // return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
        } catch (e) {
            console.error("START ERROR", e)
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data === 'getTable') {
            const user = await UserModel.findOne({ where: { chatId: `${chatId}` } })
            const table = await TablesModel.findOne({ where: { key_API: `${user.key_API}` } })
            if(table) {
                return bot.sendMessage(chatId, `https://docs.google.com/spreadsheets/d/${table.linkToTable || ''}`)
            } else {
                //если таблицы с таким ключом апишки нет, то нужно свободной таблице его назначить
                const freeTable = await TablesModel.findOne({ where: { key_API: null } })
                if(!freeTable) {
                    console.log("закончились свободные таблицы")
                    return bot.sendMessage(chatId, 'Закончились свободные таблицы')
                }
                freeTable.key_API = user.key_API
                await freeTable.save()

                return bot.sendMessage(chatId, `https://docs.google.com/spreadsheets/d/${freeTable.linkToTable || ''}`)
            }
        }
        if(data === 'auth') {
            let listenerReply

            let contentMessage = await bot.sendMessage(chatId, 'Введите ключ для работы с API статистики x64', {
                'reply_markup': {
                    'force_reply': true
                }
            })

            listenerReply = (async (replyHandler) => {
                bot.removeReplyListener(listenerReply)                
                await UserModel.create({chatId, key_API: replyHandler.text, })

                await bot.sendMessage(replyHandler.chat.id, `Ваш API-ключ ${replyHandler.text}`, {"reply_markup": {"force_reply": false}})
                await bot.sendMessage(chatId,'Получить таблицу', get_report_button)
            })
            bot.onReplyToMessage(contentMessage.chat.id, contentMessage.message_id, listenerReply)
            return 
        }
        return
    })
}

start()