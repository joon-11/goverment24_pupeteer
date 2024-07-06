const express = require('express');
const path = require('path');
const app = express();
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);

app.use(express.json());
const cors = require('cors');
const { connect } = require('http2');
app.use(cors());

app.use(bodyParser.json());

let page; // Puppeteer 페이지 변수 전역으로 선언
let inputData; // 입력 데이터 전역 변수

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
    await captchaImg.screenshot({ path: `./public/captcha.png` });

    return `./public/captcha.png`;
  } catch (error) {
    console.error('Error in connectGoverment24: ', error);
    return null;
  }
}

app.post('/connect', async (req, res) => {
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
    page = await browser.newPage();
    await page.goto('https://www.gov.kr/mw/mofa/pssptInfoTfCfrmSrch.do?capp_biz_cd=PG4CADM0439&selectedSeq=01&minwonFormSkipYn=Y#noaction');
    await page.waitForSelector('#cimg');

    const captchaImg = await page.$('#cimg');
    const boundingBox = await captchaImg.boundingBox();

    // Take screenshot and get image as Base64
    const screenshotBuffer = await page.screenshot({
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height
      }
    });

    // Convert screenshot buffer to Base64
    const base64Image = screenshotBuffer.toString('base64');

    // Send Base64 image as JSON response
    res.json({ captchaImage: base64Image });
  } catch (error) {
    console.error('Error in connect endpoint: ', error);
    res.status(500).json({ error: 'Failed to fetch captcha image' });
  }
});

app.post('/processInput', async (req, res) => {
  try {
    inputData = {
      name: req.body.name,
      jumin1: req.body.jumin1,
      jumin2: req.body.jumin2,
      phone: req.body.phone,
      passportNum: req.body.passportNum,
      issueDate: req.body.issueDate,
      expireDate: req.body.expireDate,
      confirmNum: req.body.confirmNum
    };

    // Puppeteer 페이지가 초기화되었는지 확인
    if (!page) {
      throw new Error('Puppeteer page is not initialized');
    }

    const modifiedJumin1 = inputData.jumin1.substring(2);

    await page.type('#agreeManNm', inputData.name); // 이름 입력
    await page.type('#rrn1', modifiedJumin1); // 주민등록번호 앞자리
    await page.type('#rrn2', inputData.jumin2); // 주민등록번호 뒷자리
    await page.type('#answer', inputData.confirmNum); // 확인번호 입력

    // 클릭 동작 수행 예시
    await page.click('a.buttons.big.border-color-blue.bgcolor-blue.font-color-white');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('.button-type-blue.login_btn'); // 간편인증 클릭

    // 페이지 로드를 기다림
    await page.waitForSelector('#oacxEmbededContents', { timeout: 10000 });
    console.log('요소가 나타났습니다.');

    // 페이지 내에서 추가 동작 수행 예시
    const listItems = await page.evaluate(() => {
      const listContainer = document.querySelector('div.provider-list');
      const listItemElements = listContainer.querySelectorAll('li');
      const foundItems = [];

      for (var item of listItemElements) {
        if (item.textContent.trim() === '카카오톡') {
          foundItems.push(item.textContent.trim());
          item.querySelector('a[href="javascript:void(0);"][title][class="logoBg"]').click();
        }
      }

      return foundItems;
    });

    await page.type('input[data-id="oacx_num1"]', modifiedJumin1);
    await page.type('input[data-id="oacx_num2"]', inputData.jumin2);
    await page.type('input[data-id="oacx_phone2"]', inputData.phone);
    await page.click('#totalAgree');
    await page.click('#oacx-request-btn-pc');

    return res.json({ success: true });

  } catch (error) {
    console.error('Error in processInput endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing input' });
  }
});


function connectDB(name, passportNum, issueDate, expireDate, jumin, phoneNum) {
  db.query('select passportNum from pp_info where passportNum = ?', [passportNum], function (error, results) {
    if (error) throw error;
    if (results.length == 0) {
      db.query('INSERT INTO pp_info VALUES(?,?,?,?,?,?)', [passportNum, name, jumin, phoneNum, issueDate, expireDate], function (error, data) {
        if (error) throw error;
        return res.json({ "dbconnect": "성공" });
      });
    } else {
      return res.json({ "dbconnect": "이미 있음" });
    }
  });
}

app.post('/result', async (req, res) => {
    console.log("??");
    try {
      // Ensure inputData is defined
      if (!inputData) {
        throw new Error('inputData is not defined');
      }
  
      await page.click('.basic.sky.w70');
      await page.waitForSelector('input#relerHanName');
      await page.type('input#relerHanName', inputData.name);
      await page.type('input#relerPsptNo', inputData.passportNum);
      await page.type('input#relerPsptIssYmd', inputData.issueDate);
      await page.type('input#relerPsptVldYmd', inputData.expireDate);
      await page.type('input#relerBrthdy', inputData.jumin1);
      await page.evaluate(() => {
        const button = document.querySelector('#btn_cfirm'); // Select the button inside the dialog
        if (button) {
          button.click(); // Click the button
        }
      });
      // Wait for dialog or a maximum of 5 seconds
      page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.dismiss();
      });
      
      if (dialog) {
        // If dialog is present
        console.log('Alert 내용:', dialog.message());
        const alertMessage = dialog.message();
  
        // Click the button inside the dialog using page.evaluate
        
  
        await dialog.accept();
        res.json({ 'alertMessage': alertMessage, 'status': false });
      } else {
        // If dialog is not present
        const dic = { "status": true };
        console.log(dic);
        // connectDB(inputData.name, inputData.passportNum, inputData.issueDate, inputData.expireDate, inputData.jumin1, inputData.phoneNum);
        browser.close();
        res.json(dic);
      }
    } catch (e) {
      console.log(e);
      browser.close();
      res.json({ "result": "error" });
    }
  });
  
http.listen(8080, () => {
  console.log("Listening on 8080");
});
