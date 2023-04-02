const cron = require('node-cron');
const user = require('./sql_query/user')
const crypto = require('./sql_query/crypto')
const axios = require("axios");

function sendCryptoPriceUpdatesETH(tg) {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(response => {
            crypto.findCrypto('ETH').then(value => {
                if (value.current !== response.data.ethereum.usd) {

                    user.listUsers().then(value1 => {
                        value1.forEach((user) => {
                            tg.sendMessage( user.chat_id, `Цена ethereum изменилась на з ${value.current} USD на ${response.data.ethereum.usd} USD`);
                        })
                    });
                }

            })

        })
        .catch(error => {
            console.log(error,'error')
        })

}

function sendCryptoPriceUpdatesBTC(tg) {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => {
            crypto.findCrypto('BTC').then(value => {
                if (value.current !== response.data.bitcoin.usd) {
                    user.listUsers().then(value1 => {
                        value1.forEach((user) => {
                            tg.sendMessage( user.chat_id, `Цена bitcoin изменилась на з ${value.current} USD на ${response.data.bitcoin.usd} USD`);
                        })
                    });
                }
            })

        })
        .catch(error => {
            console.log(error,'error')
        })

}
function sendCryptoPriceUpdatesSOL(tg) {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        .then(response => {
            crypto.findCrypto('SOL').then(value => {
                if (value.current !== response.data.solana.usd) {
                    user.listUsers().then(value1 => {
                        value1.forEach((user) => {
                            tg.sendMessage( user.chat_id, `Цена solana изменилась на з ${value.current} USD на ${response.data.solana.usd} USD`);
                        })
                    });
                }
            })

        })
        .catch(error => {
            console.log(error,'error')
        })

}

module.exports = (tg) => {
    cron.schedule('* * * * *', () => {
        sendCryptoPriceUpdatesSOL(tg)
        sendCryptoPriceUpdatesBTC(tg)
        sendCryptoPriceUpdatesETH(tg)
    });


}
