module.exports = {
    auth_inline: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Авторизоваться', callback_data: 'auth'}],
            ]
        })
    },
    get_report_button: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Получить таблицу', callback_data: 'getTable'}],
            ]
        })
    },
}