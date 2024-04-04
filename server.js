const express = require('express');
const path = require('path');
const app = express();
const puppeteer = require('puppeteer');

const http = require('http').createServer(app);


async function connectGoverment24() {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            ]
        });

        const page = await browser.newPage();

        await page.goto('https://www.gov.kr/mw/mofa/pssptInfoTfCfrmSrch.do?capp_biz_cd=PG4CADM0439&selectedSeq=01&minwonFormSkipYn=Y#noaction');

        await page.waitForSelector('#cimg');
  
        // Select the CAPTCHA image element
        const captchaImg = await page.$('#cimg');
        
        // Take a screenshot of the CAPTCHA image
        await captchaImg.screenshot({ path: './public/captcha.png' });
    } catch (error) {
        console.error('Error in connectGoverment24: ', error);
        return null;
    }
}

connectGoverment24()

// 8080번 포트에서 서버를 실행할거야
http.listen(8080, () => {
  // 서버가 정상적으로 실행되면 콘솔창에 이 메시지를 띄워줘
  console.log("Listening on 8080");
});

app.use(express.static(path.join(__dirname, '/build')));

// 메인페이지 접속 시 build 폴더의 index.html 보내줘
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/index.js'));
    
  });
  
  // 나머지 라우트는 기본적으로 index.html을 제공하도록 설정
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/index.js'));
  });

app.get('/getWebSocket', async (req, res) => {

});



// await page.type('#agreeManNm', '김준')//이름
// await page.type('#rrn1', '060412')//주민등록번호
// await page.type('#rrn2', '3083318')


// const buttonClickedMessage = await page.evaluate(() => {
//     return new Promise(resolve => {
//         // Select the button by its class
//         document.querySelector('.buttons.big.border-color-blue.bgcolor-blue.font-color-white').addEventListener('click', () => {
//             resolve('Button clicked!');
//         });
//     });
// });

// console.log(buttonClickedMessage);

// await new Promise(resolve => setTimeout(resolve, 1000));

// await page.click('.button-type-blue.login_btn');//간편인증 클릭

// try {
//     // 해당 요소가 나타날 때까지 기다림 (최대 10초)
//     await page.waitForSelector('#oacxEmbededContents', { timeout: 10000 });
//     console.log('요소가 나타났습니다.');

//     const listItems = await page.evaluate(() => {
//         const listContainer = document.querySelector('div.provider-list');
//         const listItemElements = listContainer.querySelectorAll('li');
//         const foundItems = [];
        
//         for (var item of listItemElements) {
//             if(item.textContent.trim() === '카카오톡') {
//                 foundItems.push(item.textContent.trim())

//                 item.querySelector('a[href="javascript:void(0);"][title][class="logoBg"]').click();
//             }
//         }
        
//         return foundItems;
//     });


//     await page.type('input[data-id="oacx_num1"]', '060412');
//     await page.type('input[data-id="oacx_num2"]', '3083318');
//     await page.type('input[data-id="oacx_phone2"]', '50902886');
//     await page.click('#totalAgree');
//     await page.click('#oacx-request-btn-pc');

//     await page.waitForSelector('input#relerHanName');

//     await page.type('input#relerHanName', '김준');
//     await page.type('input#relerPsptNo', 'M883W7051');
//     await page.type('input#relerPsptIssYmd', '20231120');
//     await page.type('input#relerPsptVldYmd', '20281120');
//     await page.type('input#relerBrthdy', '20060412');
//     await page.evaluate(() => {
//         const button = document.getElementById('btn_cfirm');
//         button.click(); 
//     });


//   } catch (error) {
//     console.log(error)
//     console.error('요소가 나타나지 않았거나 시간이 초과되었습니다.');
//   }

app.use(express.json());
const cors = require('cors');
app.use(cors());

