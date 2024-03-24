type FormatMonetaireOptions = {
  locale: string
  options: {
    style: string
    currency: string
  };
};

export function formatMonetaire(montant: number, option?: FormatMonetaireOptions ): string {
    if (option) {
        return montant.toLocaleString(option.locale, option.options)
    }
    return montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}


export const isDifferentPass = (password: string, password2: string) => (password !== password2)

export const isValidPassword = (password: string, passwordOption = {'num': 1, 'length': 8, 'special': 1}) => (
  password.length >= passwordOption.length && 
  (password.match(/\d/g) || []).length >= passwordOption.num && 
  (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= passwordOption.special
)

export const isValidEmail = (email: string) => (
  (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(String(email).toLowerCase())
)

