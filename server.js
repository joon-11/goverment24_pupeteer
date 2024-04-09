const express = require('express');
const path = require('path');
const app = express();
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

const http = require('http').createServer(app);

app.use(bodyParser.json());

let page; // Declare page outside of the function

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

        page = await browser.newPage(); // Assign value to page variable

        await page.goto('https://www.gov.kr/mw/mofa/pssptInfoTfCfrmSrch.do?capp_biz_cd=PG4CADM0439&selectedSeq=01&minwonFormSkipYn=Y#noaction');

        await page.waitForSelector('#cimg');
  
        const captchaImg = await page.$('#cimg');
        
        await captchaImg.screenshot({ path: './public/captcha.png' });
    } catch (error) {
        console.error('Error in connectGoverment24: ', error);
        return null;
    }
}

connectGoverment24();

app.post('/processInput', async (req, res) => {
    const inputData = {
        name: req.body.name,
        jumin1: req.body.jumin1,
        jumin2: req.body.jumin2,
        phone: req.body.phone,
        passportNum: req.body.passportNum,
        issueDate: req.body.issueDate,
        expireDate: req.body.expireDate,
        confirmNum: req.body.confirmNum
    };

    await page.type('#agreeManNm', '김준'); // Typing name on the page
    await page.type('#rrn1', '060412');//주민등록번호
    await page.type('#rrn2', '3083318');
    await page.type('#answer', inputData.confirmNum);
    await page.click('a.buttons.big.border-color-blue.bgcolor-blue.font-color-white');
    await new Promise(resolve => setTimeout(resolve, 1000));    
    await page.click('.button-type-blue.login_btn');//간편인증 클릭
    

    try {
        await page.waitForSelector('#oacxEmbededContents', { timeout: 10000 });
        console.log('요소가 나타났습니다.');

        const listItems = await page.evaluate(() => {
            const listContainer = document.querySelector('div.provider-list');
            const listItemElements = listContainer.querySelectorAll('li');
            const foundItems = [];
            
            for (var item of listItemElements) {
                if(item.textContent.trim() === '카카오톡') {
                    foundItems.push(item.textContent.trim())

                    item.querySelector('a[href="javascript:void(0);"][title][class="logoBg"]').click();
                }
            }
            
            return foundItems;
        });

            await page.type('input[data-id="oacx_num1"]', '060412');
            await page.type('input[data-id="oacx_num2"]', '3083318');
            await page.type('input[data-id="oacx_phone2"]', '50902886');
            await page.click('#totalAgree');
            await page.click('#oacx-request-btn-pc');

            app.post('/result', async (req, res) => {
                await page.click('.basic.sky.w70');
                await page.waitForSelector('input#relerHanName');
                await page.type('input#relerHanName', '김준');
                await page.type('input#relerPsptNo', 'M883W7051');
                await page.type('input#relerPsptIssYmd', '20231120');
                await page.type('input#relerPsptVldYmd', '20281120');
                await page.type('input#relerBrthdy', '20060412');
                await page.evaluate(() => {
                    const button = document.getElementById('btn_cfirm');
                    button.click(); 
                });

                await page.waitForSelector('.notice-infor-txt li');

                const liTextContent = await page.evaluate(() => {
                    const liElement = document.querySelector('.notice-infor-txt li');
                    return liElement !== null;
                  });
                
                  res.json({ liTextContent });
        
            })
            
    } catch (error) {
        console.error('Error in connectGoverment24: ', error);
        return null;
    }

}); 


// Your other routes and server setup...
// Replace with your actual server setup, such as serving static files, defining other routes, and starting the server.

http.listen(8080, () => {
    console.log("Listening on 8080");
});

app.use(express.static(path.join(__dirname, '/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/index.js'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/src/index.js'));
});

app.get('/getWebSocket', async (req, res) => {
    console.log("WebSocket request received");
});

app.use(express.json());
const cors = require('cors');
app.use(cors());
