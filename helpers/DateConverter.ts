import jalaali from 'jalaali-js';
import i18nCustom from '@/lang/i18nCustom.ts'
import moment from 'moment-hijri';
export default class DateConverter {
    /**
     * Converts Persian numeral characters in a string to English numerals.
     * @param input - String containing Persian numerals.
     * @returns The input string with Persian numerals converted to English numerals.
     */
    static convertPersianNumbersToEnglish(input: string): string {
        // بررسی اینکه آیا ورودی تنها شامل حروف انگلیسی و اعداد انگلیسی است
        const isEnglish = /^[\u0000-\u007F]*$/.test(input);

        if (isEnglish) {
            return input;
        }

        return input.replace(/[\u06F0-\u06F9]/g, (char) => {
            return String.fromCharCode(char.charCodeAt(0) - 1728);
        });
    }

    /**
     * Converts a Jalali date string to a Gregorian date string.
     * @param jalaliDateStr
     * @param outputFormat - Desired output format.
     * @returns The equivalent date string in Gregorian format.
     */
    static convertJalaliToGregorian(jalaliDateStr: string, outputFormat: string = 'yyyy-MM-dd'): string {
        const [datePart, timePart] = jalaliDateStr.split('T');
        const [year, month, day] = datePart.split('/').map(Number);

        // Convert Jalali date to Gregorian date
        const gregorianDate = jalaali.toGregorian(year, month, day);

        // Create a Date object
        const date = new Date(gregorianDate.gy, gregorianDate.gm - 1, gregorianDate.gd);

        return this.formatDate(date, outputFormat, timePart);
    }

    /**
     * Converts a Gregorian date string to a Jalali date string.
     * @param gregorianDateStr - Date string in Gregorian format.
     * @param outputFormat - Desired output format.
     * @returns The equivalent date string in Jalali format.
     */
    static convertGregorianToJalali(gregorianDateStr: string, outputFormat: string = 'yyyy/MM/dd'): string {
        const [datePart, timePart] = gregorianDateStr.split('T');
        const [year, month, day] = datePart.split('-').map(Number);

        // Convert Gregorian date to Jalali date
        const jalaliDate = jalaali.toJalaali(year, month, day);
        // Create a Date object
        const date = new Date(year, month - 1, day);
        return this.formatDate(date, outputFormat, timePart, jalaliDate);
    }

    /**
     * Converts a Gregorian date string to a Hijri (Islamic) date string.
     * @param gregorianDateStr - Date string in Gregorian format.
     * @param outputFormat - Desired output format.
     * @returns The equivalent date string in Hijri format.
     */
    static convertGregorianToHijri(
        gregorianDateStr: string,
        outputFormat: string = 'yyyy/MM/dd'
    ): string {
        const [datePart] = gregorianDateStr.split('T');
        const [year, month, day] = datePart.split('-').map(Number);

        // تبدیل تاریخ میلادی به هجری
        let hijriDate = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').locale('en');

        // // اصلاح اختلاف یک روز
        // hijriDate.subtract(1, 'day');

        // نام ماه‌های هجری
        const hijriMonths = [
            "محرم", "صفر", "ربیع‌الأول", "ربیع‌الثانی", "جمادی‌الأول", "جمادی‌الثانی",
            "رجب", "شعبان", "رمضان", "شوال", "ذی‌القعده", "ذی‌الحجه"
        ];
        const arabicWeekdays_ = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
        // const arabicWeekdays_ = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

        // استخراج مقادیر تاریخ هجری
        const hy = hijriDate.iYear();
        const hm = hijriDate.iMonth();
        const hd = hijriDate.iDate();
        const hijriMonthName = hijriMonths[hm];

        // دریافت روز هفته هجری
        const hijriWeekdayIndex = hijriDate.day(); // روز هفته (0 برای یکشنبه، 6 برای شنبه)
        const hijriWeekday = arabicWeekdays_[hijriWeekdayIndex];

        // جایگزینی مقادیر در فرمت خروجی
        const formattedDate = outputFormat
            .replace('iYYYY', hy.toString())
            .replace('MMMM', hijriMonthName) // نام ماه هجری
            .replace('mmmm', hijriMonthName) // نام ماه هجری
            .replace('yyyy', hy.toString())
            .replace('DDDD', hijriWeekday) // روز هفته صحیح
            .replace('iMM', (hm + 1).toString().padStart(2, '0')) // شماره ماه هجری
            .replace('MM', (hm + 1).toString().padStart(2, '0')) // شماره ماه هجری
            .replace('iDD', hd.toString().padStart(2, '0')) // روز هجری
            .replace('dd', hd.toString()); // عدد روز

        return formattedDate;
    }


    static convertHijriToGregorian(hijriDateStr: string, outputFormat: string = 'yyyy-MM-dd'): string {
        const [datePart, timePart] = hijriDateStr.split('T');
        const [year, month, day] = datePart.split('/').map(Number);

        // تبدیل تاریخ هجری قمری به میلادی
        const gregorianMoment = moment(`${year}/${month}/${day}`, 'iYYYY/iM/iD').locale('en');

        // استخراج تاریخ به فرمت استاندارد ISO برای جلوگیری از مقدار نامعتبر
        const gregorianDate = gregorianMoment.format('YYYY-MM-DD');

        return timePart ? `${gregorianDate}T${timePart}` : gregorianDate;
    }

    /**
     * Formats a date object to a specified format.
     * @param date - Date object to format.
     * @param format - Desired output format.
     * @param timePart - Time part of the date string (optional).
     * @param jalaliDate - Jalali date object (optional).
     * @returns The formatted date string.
     */
    static formatDate(date: Date, format: string, timePart?: string, jalaliDate?: {
        jy: number,
        jm: number,
        jd: number
    }): string {
        const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const weekdays_ = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const jalaliWeekdays = ["یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
        const jalaliWeekdays_ = ["ی", "د", "س", "چ", "پ", "ج", "ش"];
        const jalaliMonths = [
            "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
            "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
        ];

        const gy = date.getFullYear();
        const gm = (date.getMonth() + 1).toString().padStart(2, '0');
        const gd = date.getDate().toString().padStart(2, '0');
        const dayOfWeek = weekdays[date.getDay()];
        const dayOfWeek_ = weekdays_[date.getDay()];
        const monthName = months[date.getMonth()];
        const monthName_ = monthNames[date.getMonth()];
        let jy = jalaliDate ? jalaliDate.jy : gy;
        let jm = jalaliDate ? jalaliDate.jm.toString().padStart(2, '0') : gm;
        let jd = jalaliDate ? jalaliDate.jd.toString().padStart(2, '0') : gd;
        const jalaliMonthName = jalaliDate ? jalaliMonths[jalaliDate.jm - 1] : monthName;
        const jalaliDayOfWeek = jalaliDate ? jalaliWeekdays[date.getDay()] : dayOfWeek;
        const jalaliDayOfWeek_ = jalaliDate ? jalaliWeekdays_[date.getDay()] : dayOfWeek;
        let formattedDate = format
            .replace('dddd', jalaliDate ? jalaliDayOfWeek : dayOfWeek)
            .replace('DDDD', jalaliDate ? jalaliDayOfWeek_ : dayOfWeek_)
            .replace('MMMM', jalaliDate ? jalaliMonthName : monthName)
            .replace('mmmm', jalaliDate ? jalaliMonthName : monthName_)
            .replace('yyyy', jalaliDate ? jy.toString() : gy.toString())
            .replace('yy', jalaliDate ? jy.toString().slice(-2) : gy.toString().slice(-2))
            .replace('MM', jalaliDate ? jm : gm)
            .replace('dd', jalaliDate ? jd : gd);

        if (timePart) {
            const [hours, minutes, seconds] = timePart.split(':').map(Number);
            const hh = hours.toString().padStart(2, '0');
            const mm = minutes.toString().padStart(2, '0');
            const ss = seconds ? seconds.toString().padStart(2, '0') : '00';
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hh12 = (hours % 12 || 12).toString().padStart(2, '0');

            formattedDate = formattedDate
                .replace('HH', hh)
                .replace('hh', hh12)
                .replace('mm', mm)
                .replace('ss', ss)
                .replace('AA', ampm);
        }
        return formattedDate;
    }

    /**
     * Converts a date string to the requested format (Gregorian, Jalali, or Hijri).
     * @param dateString - Date string in either Jalali, Gregorian, or Hijri format.
     * @param format - Desired output format: 'jalali', 'gregorian', or 'hijri'.
     * @param outputFormat - Custom format for the output date string.
     * @returns The date string converted to the specified format.
     * @throws Error if the input format is unsupported.
     */
    static convertDateFormat(
        dateString: string,
        outputFormat: string = 'yyyy-MM-dd',
        format: 'jalali' | 'gregorian' | 'hijri' = 'gregorian'
    ): string {
        const standardizedDateString = this.convertPersianNumbersToEnglish(dateString);
        let formatNew = format;
        let outputFormatNew = outputFormat;
        if (format === 'jalali') {
            switch (i18nCustom.global.locale) {
                case "ar":
                    formatNew = 'hijri';
                    break;
                case "fa":
                    formatNew = 'jalali';
                    break;
                default:
                    formatNew = 'gregorian';
            }
            // formatNew = (i18nCustom.global.locale === 'ar' || i18nCustom.global.locale === 'fa') ? 'jalali' : 'gregorian';

            if (outputFormat === 'yyyy/MM/dd') {
                switch (i18nCustom.global.locale) {
                    case "ar":
                        outputFormatNew = 'yyyy/MM/dd';
                        break;
                    case "fa":
                        outputFormatNew = 'yyyy/MM/dd';
                        break;
                    default:
                        outputFormatNew = 'yyyy-MM-dd';
                }
            }
        }
        if (formatNew === 'jalali') {
            // Check if input date string is in Gregorian format
            const isGregorianDate = standardizedDateString.includes('-');

            if (isGregorianDate) {
                return this.convertGregorianToJalali(standardizedDateString, outputFormatNew);
            } else {
                // Directly format Jalali date if it is already in Jalali format
                const [year, month, day] = standardizedDateString.split('/').map(Number);
                const jalaliDate = {jy: year, jm: month, jd: day};
                const date = new Date(jalaali.toGregorian(year, month, day).gy, jalaali.toGregorian(year, month, day).gm - 1, jalaali.toGregorian(year, month, day).gd);
                return this.formatDate(date, outputFormatNew, undefined, jalaliDate);
            }
        } else if (formatNew === 'hijri') {

            // بررسی نوع تاریخ ورودی برای قمری
            const isGregorianDate = standardizedDateString.includes('-');
            if (isGregorianDate) {
                return this.convertGregorianToHijri(standardizedDateString, outputFormatNew);
            }
        }else if (formatNew === 'gregorian') {
            // Check if input date string is in Jalali format
            const isJalaliDate = standardizedDateString.includes('/');
            if (isJalaliDate) {
                if (i18nCustom.global.locale == 'ar'){
                    return this.convertHijriToGregorian(standardizedDateString, outputFormatNew);
                }else{
                    return this.convertJalaliToGregorian(standardizedDateString, outputFormatNew);
                }

            } else {
                // Directly format Gregorian date if it is already in Gregorian format
                const [datePart, timePart] = standardizedDateString.split('T');
                const [year, month, day] = datePart.split('-').map(Number);
                const date = new Date(year, month - 1, day);

                return this.formatDate(date, outputFormatNew, timePart);
            }
        }else {
            throw new Error(`Unsupported format '${formatNew}'. Supported formats are 'jalali' and 'gregorian'.`);
        }
    }
}
