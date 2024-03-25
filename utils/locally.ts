export const locally = {
    //localStorage functions
    
    getItem(item: string) {
        if (process.client) {
            return localStorage.getItem(item)    
        } else {
            return undefined
        }
    },
    setItem(item: string, value: object | string | number) {
        if (process.client) {
            return localStorage.setItem(item, value)
        }
    }
}
