const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("cucumber");
const { getText, clickElement } = require("../../lib/commands.js");
const { confirmBooking, getFreeRandomChair, gotoAfterTomorrowHallOne} = require("../../lib/util.js");

let rows = 11, chairsInRow = 10; // рядов, кресел в ряду в Зале 1
let freeChair;

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 300 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on cinema hall page", { timeout: 60 * 1000 }, async function () {
  await this.page.goto("http://qamid.tmweb.ru");
  return await gotoAfterTomorrowHallOne(this.page);
});

When("user selects one free chair", { timeout: 60 * 1000 }, async function () {
  freeChair = await getFreeRandomChair(this.page, rows, chairsInRow);
  return await clickElement(this.page, freeChair);
});

When("user selects three free chairs", { timeout: 60 * 1000 }, async function () {
  for (let i = 0; i < 3; i++) {
    let freeChair = await getFreeRandomChair(this.page, rows, chairsInRow);
    await clickElement(this.page, freeChair);
  }
});

When( "user get the QR", { timeout: 60 * 1000 }, async function () {
  return await confirmBooking(this.page);
});

When("user return to cinema hall", { timeout: 60 * 1000 }, async function () {
  await this.page.goto("http://qamid.tmweb.ru");
  return await gotoAfterTomorrowHallOne(this.page);
});

When("user selects same chair", { timeout: 60 * 1000 }, async function () {
  return await clickElement(this.page, freeChair);
});

Then("user get the QR with selector {string} and 3 places", { timeout: 60 * 1000 }, async function (string) {
  const actual = await confirmBooking(this.page);
  const expected = await string;
  expect(actual).contains(expected);
  let chairs = (await getText(this.page, "p:nth-child(2) > span")).split(", ");
  expect(chairs.length).equal(3);
});

Then("user get the QR with selector {string}", { timeout: 60 * 1000 }, async function (string) {
  const actual = await confirmBooking(this.page);
  const expected = await string;
  expect(actual).contains(expected);
});

Then("user can't book and chair selector is {string}", { timeout: 60 * 1000 }, async function (string) {
  let className = await this.page.$eval(freeChair, (el) => el.classList[2]);
  expect(className).contains(string);
});