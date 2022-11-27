export class Strings {
    public static getBetween(text: String, begin: String, last: String) {
        // @ts-ignore
        return text.split(begin).pop().split(last)[0];
    }
    public static snakeCase(string: String) {
        return string.replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('_');
    }
}
