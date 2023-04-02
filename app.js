const config = require('./helper/config')
const user = require('./sql_query/user')
const crypto = require('./sql_query/crypto')
const cron_job=require('./cron')

const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios");

const tokenTelegram =config.token_telegram;

const tg = new TelegramBot(tokenTelegram, {polling: true});

let register={
    step:0,
    info:{
        name:'',
        email:'',
        password:''
    }
} ;
tg.setMyCommands([
    {
        command:'/btc' ,description:'Курс BTC'
    },
    {
        command:'/sol' ,description:'Курс SOL'
    },
    {
        command:'/eth' ,description:'Курс ETH'
    },
    {
        command:'/rating' ,description:'3 популярні криптовалюти'
    }
    ,{
        command:'/start' ,description:'START'
    }
])

//Реєстрація
tg.onText(/\/start/, async (msg) => {
    let userInfo = await user.findUser(msg.chat.id);
    if (userInfo) {
        tg.sendMessage(msg.chat.id, `Доброго дня ${userInfo.name} ви вже зареєстровані.Ваш Email : ${userInfo.email}.`)
    } else {
        tg.sendMessage(msg.chat.id, 'Введіть name:').then(value => {
            register.step = 1
        });


    }
});

tg.on( "message", async (msg) => {
    if (register.step===1 && msg.text!=='/start' ){
        tg.sendMessage(msg.chat.id, 'Введіть email:');
        register.info.name=msg.text;
        register.step=2;
    }
    else if (register.step === 2) {
        tg.sendMessage(msg.chat.id, 'Введіть password:');
        register.info.email=msg.text;
        register.step= 3;
    }
    else if(register.step === 3) {
        register.info.password=msg.text;
        const users=await user.creatUser(register.info.name,msg.chat.id,register.info.email,register.info.password);
        register.step= null;
        register.info={
            name:'',
            email:'',
            password:''
        };
    }
});

//Курс Bitcoin

tg.onText(/\/btc/, async (msg) => {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => {
            const price = response.data.bitcoin.usd;
            crypto.creatCrypto(response.data.bitcoin.usd,'BTC')
            tg.sendMessage(msg.chat.id, `Курс Bitcoin:${price}$`);
        })
        .catch(error => {
            console.log(error,'error')
            tg.sendMessage(msg.chat.id, 'Помилка при команді /btc');
        })
});

//Курс Solana

tg.onText(/\/sol/, async (msg) => {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        .then(response => {
            const price = response.data.solana.usd;
            crypto.creatCrypto(response.data.solana.usd,'SOL')
            tg.sendMessage(msg.chat.id, `Курс Solana:${price}$`);
        })
        .catch(error => {
            console.log(error,'error')
            tg.sendMessage(msg.chat.id, 'Помилка при команді /sol');
        })
});

//Курс Ethereum

tg.onText(/\/eth/, async (msg) => {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        .then(response => {
            const price = response.data.ethereum.usd;
            crypto.creatCrypto(response.data.ethereum.usd,'ETH')
            tg.sendMessage(msg.chat.id, `Курс Ethereum:${price}$`);
        })
        .catch(error => {
            console.log(error,'error')
            tg.sendMessage(msg.chat.id, 'Помилка при команді /eth');
        })
});

//Виводить  інформацію про 3 перших криптовалюти

tg.onText(/\/rating/, async (msg) => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=3&page=1&sparkline=false')
        .then(response => {
            const data = response.data;
            tg.sendMessage(msg.chat.id, JSON.stringify(data,null,4));
        })
        .catch(error => {
            console.log(error,'error')
            tg.sendMessage(msg.chat.id, 'Помилка при команді /rating');
        })
});


cron_job(tg)
