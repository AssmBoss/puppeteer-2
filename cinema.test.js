const { clickElement, getText } = require("./lib/commands.js");
const { confirmBooking, getFreeRandomChair, gotoAfterTomorrowHallOne } = require("./lib/util.js");

let page;
let rows = 11, chairsInRow = 10; // рядов, кресел в ряду в Зале 1

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("ИдёмВКино tests", () => {
  beforeEach(async () => {
    //открыть сайт
    page = await browser.newPage();
    await page.goto("http://qamid.tmweb.ru");
  });

  test("should book one chair'", async () => {
    await gotoAfterTomorrowHallOne(page);
    let freeChair = await getFreeRandomChair(page, rows, chairsInRow); // выбрать случайное свободное кресло в зале
    await clickElement(page, freeChair);
    let actual = await confirmBooking(page); // забронировать кресло и проверить, что высветился QR
    expect(actual).toContain("ticket__info-qr");
  });

  test("should book THREE chairs'", async () => {
    await gotoAfterTomorrowHallOne(page);
    for (let i = 0; i < 3; i++) { // выбрать ТРИ случайных свободных кресла в зале
      let freeChair = await getFreeRandomChair(page, rows, chairsInRow);
      await clickElement(page, freeChair);
    }
    let actual = await confirmBooking(page); // забронировать кресла и проверить, что высветился QR
    expect(actual).toContain("ticket__info-qr");
    let chairs = (await getText(page, "p:nth-child(2) > span")).split(", "); // проверить, что забронировано именно ТРИ кресла
    expect(chairs.length).toEqual(3);
  });

  test("shouldn't book one chair twice'", async () => {
    await gotoAfterTomorrowHallOne(page);
    let freeChair = await getFreeRandomChair(page, rows, chairsInRow); // выбрать случайное свободное кресло в зале
    await clickElement(page, freeChair);
    let actual = await confirmBooking(page); // забронировать кресло и проверить, что высветился QR
    expect(actual).toContain("ticket__info-qr");
    await page.goto("http://qamid.tmweb.ru"); // вернуться в ту же дату и в тот же зал
    await gotoAfterTomorrowHallOne(page);
    await clickElement(page, freeChair); // и попытаться выбрать то же самое место
    let className = await page.$eval(freeChair, (el) => el.classList[2]); // проверить имя класса выбранного кресла - должно быть "buying-scheme__chair_taken"
    expect(className).toContain("buying-scheme__chair_taken");
  });
});
