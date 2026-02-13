const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('SauceDemo Automation Test - Login & Sort Z-A', function () {
    let driver;

    before(async function () {
        let options = new chrome.Options();
        options.addArguments('--incognito');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Sukses Login dan Sorting Produk Z-A', async function () {

        await driver.get('https://www.saucedemo.com');

        // Assert Title
        const title = await driver.getTitle();
        assert.strictEqual(title, 'Swag Labs');

        // Login
        await driver.findElement(By.css('[data-test="username"]'))
            .sendKeys('standard_user');

        await driver.findElement(By.css('[data-test="password"]'))
            .sendKeys('secret_sauce');

        await driver.findElement(By.css('[data-test="login-button"]'))
            .click();

        // Tunggu sampai halaman inventory muncul
        await driver.wait(
            until.elementLocated(By.className('inventory_item')),
            10000
        );

        // Assert logo
        let logoText = await driver.findElement(By.className('app_logo')).getText();
        assert.strictEqual(logoText, 'Swag Labs');

        // Sorting Z-A
        let dropdownSort = await driver.findElement(By.css('[data-test="product-sort-container"]'));
        await dropdownSort.click();

        let optionZA = await driver.findElement(
            By.xpath('//option[text()="Name (Z to A)"]')
        );
        await optionZA.click();

        // Tunggu produk reload
        await driver.sleep(2000);

        // Ambil semua nama produk
        let items = await driver.findElements(By.className('inventory_item_name'));

        let productNames = [];
        for (let item of items) {
            productNames.push(await item.getText());
        }

        // Sort manual Z-A
        let expectedSorted = [...productNames].sort().reverse();

        // Validasi apakah benar Z-A
        assert.deepStrictEqual(productNames, expectedSorted);

    });

});
