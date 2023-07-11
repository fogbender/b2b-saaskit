import { addYears, dateTo12HourTime, differenceInCalendarDays, formatRelative } from "./date";
describe("date utils", () => {
  describe("dateTo12HourTime(date)", () => {
    const cases = [
      [void 0, ""],
      [/* @__PURE__ */ new Date("1/1/2020 23:15"), "11:15 PM"],
      [/* @__PURE__ */ new Date("1/1/2020 11:15"), "11:15 AM"],
      [/* @__PURE__ */ new Date("1/1/2020 01:59"), "01:59 AM"],
      [/* @__PURE__ */ new Date("1/1/2020 13:59"), "01:59 PM"],
      [/* @__PURE__ */ new Date("1/1/2020 00:59"), "12:59 AM"]
    ];
    it.each(cases)(".dateTo12HourTime(%s) => %s", (a, expected) => {
      expect(dateTo12HourTime(a)).toBe(expected);
    });
  });
  describe("differenceInCalendarDays(date1, date2)", () => {
    const cases = [
      [void 0, /* @__PURE__ */ new Date(), { absolute: true }, 0],
      [/* @__PURE__ */ new Date("1/1/2020"), /* @__PURE__ */ new Date("1/2/2020"), { absolute: true }, 1],
      [/* @__PURE__ */ new Date("1/1/2020"), /* @__PURE__ */ new Date("1/3/2020"), { absolute: true }, 2],
      [/* @__PURE__ */ new Date("1/30/2020"), /* @__PURE__ */ new Date("1/31/2020"), { absolute: true }, 1],
      [/* @__PURE__ */ new Date("1/30/2020"), /* @__PURE__ */ new Date("2/1/2020"), { absolute: true }, 2],
      [/* @__PURE__ */ new Date("1/1/2020"), /* @__PURE__ */ new Date("2/1/2020"), { absolute: true }, 31],
      [/* @__PURE__ */ new Date("1/1/2020"), /* @__PURE__ */ new Date("1/2/2020"), { absolute: false }, 1],
      [/* @__PURE__ */ new Date("1/1/2020"), /* @__PURE__ */ new Date("1/5/2020"), { absolute: false }, 4],
      [/* @__PURE__ */ new Date("1/5/2020"), /* @__PURE__ */ new Date("1/1/2020"), { absolute: true }, 4],
      [/* @__PURE__ */ new Date("1/5/2020"), /* @__PURE__ */ new Date("1/1/2020"), { absolute: false }, -4]
    ];
    it.each(cases)(".differenceInCalendarDays(%s,%s) => %s", (a, b, c, expected) => {
      expect(differenceInCalendarDays(a, b, c)).toBe(expected);
    });
  });
  describe("formatRelative(date)", () => {
    const cases = [
      [void 0, void 0, null],
      [/* @__PURE__ */ new Date("1/1/2020 23:15"), /* @__PURE__ */ new Date("1/1/2020"), "sameDay"],
      [/* @__PURE__ */ new Date("1/5/2020 23:15"), /* @__PURE__ */ new Date("1/6/2020"), "lastDay"],
      [/* @__PURE__ */ new Date("1/3/2020 23:15"), /* @__PURE__ */ new Date("1/6/2020"), "previous6Days"],
      [/* @__PURE__ */ new Date("1/7/2020 23:15"), /* @__PURE__ */ new Date("1/6/2020"), "nextDay"],
      [/* @__PURE__ */ new Date("1/10/2020 23:15"), /* @__PURE__ */ new Date("1/6/2020"), "next6Days"],
      [/* @__PURE__ */ new Date("12/10/2020 23:15"), /* @__PURE__ */ new Date("1/6/2020"), "other"],
      [/* @__PURE__ */ new Date("12/10/2020 23:15"), /* @__PURE__ */ new Date("1/6/2021"), "other"]
    ];
    it.each(cases)(".formatRelative(%s, %s) => %s", (a, b, expected) => {
      expect(formatRelative({ date: a, relativeTo: b })?.relativeDateCase || null).toBe(expected);
    });
  });
  describe("addYears(date, number)", () => {
    const cases = [
      [/* @__PURE__ */ new Date("1/1/2020 23:15"), 1, /* @__PURE__ */ new Date("1/1/2021 23:15")],
      [/* @__PURE__ */ new Date("1/1/2019 23:15"), 1, /* @__PURE__ */ new Date("1/1/2020 23:15")],
      [/* @__PURE__ */ new Date("1/1/2021 23:15"), 100, /* @__PURE__ */ new Date("1/1/2121 23:15")],
      [/* @__PURE__ */ new Date("1/1/2021 23:15"), 0, /* @__PURE__ */ new Date("1/1/2021 23:15")]
    ];
    it.each(cases)(".addYears(%s, %s) => %s", (a, b, expected) => {
      expect(addYears(a, b)).toStrictEqual(expected);
    });
  });
});
//# sourceMappingURL=date.test.js.map