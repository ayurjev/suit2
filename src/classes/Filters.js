
/**
 * Filters for variables
 */
export class Filters {

    constructor(value) { this.value = value; }

    /**
     * Length of the object
     */
    length() {
        if (!this.value) return 0;
        if (this.value instanceof Object) {
            var counter = 0;
            for (var k in this.value) counter++;
            return counter;
        }
        if (this.value === true) return 1;
        return this.value.length;
    }

    /**
     * Formatting dates/times
     */
    format(format_str) {
        var date_obj = this.value instanceof Date ? this.value : new Date(this.value);
        if (Object.prototype.toString.call(date_obj) != "[object Date]" || isNaN(date_obj.getTime())) { return date; }
        var pad = (val) => { return String(val).length == 1 ? "0" + val : val; };
        format_str = format_str.replace("%d", pad(date_obj.getDate()));
        format_str = format_str.replace("%m", pad(date_obj.getMonth() + 1));
        format_str = format_str.replace("%y", String(date_obj.getFullYear())[2] + String(date_obj.getFullYear())[3]);
        format_str = format_str.replace("%Y", date_obj.getFullYear());
        format_str = format_str.replace("%H", pad(date_obj.getHours()));
        format_str = format_str.replace("%M", pad(date_obj.getMinutes()));
        format_str = format_str.replace("%S", pad(date_obj.getSeconds()));
        return format_str;
    }

    /**
     * Searching variable in some haystack
     */
    in(haystack) {
        var needle = this.value;
        if (needle == null || haystack == null) { return false; }
        if (typeof(haystack) == "string")
        {
            try                                 { haystack = JSON.parse(haystack); }
            catch (e)                           { return !!(haystack.indexOf(needle) > -1); }
        }
        if (haystack instanceof Array)          { return haystack.indexOf(needle) > -1; }
        if (haystack instanceof Object)         { return needle in haystack; }
    };

    /**
     *  Selecting correct form of the word based on given number
     */
    pluralword(words) {
        if (typeof(words) == "string") words = JSON.parse(words);
        var num = parseInt(this.value) % 100;
        if (num > 19) { num = num % 10; }
        return {1: words[0], 2: words[1], 3: words[1], 4: words[1]}[num] || words[2];
    };

    /**
     * Unquoting special characters
     */
    html() {
        return decodeURI(this.value
            .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x2F;/g, "/")
        );
    }

     // Other filters:
    json()              { return JSON.stringify(this.value); }
    exists()            { return this.length() > 0; }
    pluralform(words)   { return this.value + " " + this.pluralword(words); };
    startswith(prefix)  { return this.value.indexOf(prefix) == 0; }
    endswith(suffix)    { return this.value.indexOf(suffix) == this.value.length - suffix.length; }
    contains(needle)    { return new Filters(needle).in(this.value); };
}
