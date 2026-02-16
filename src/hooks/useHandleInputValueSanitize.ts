export const useHandleInputValueSanitize = () => {
    const handleInputValueSanitize: (inputVal: string) => string = (inputVal: string) => {
        return inputVal
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll(/"/g, "&quot;")
            .replaceAll("'", "&#39;")
            .replaceAll('%', '&#37;')
            .replaceAll('=', '&#61;')
            .replaceAll('$', '&#36;')
            .replaceAll('script', 'すくりぷと')
            .replaceAll('link', 'りんく');
    }

    return { handleInputValueSanitize }
}