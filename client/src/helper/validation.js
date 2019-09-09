export const required = value => (value || typeof value === 'number' ? undefined : '入力必須項目です')
export const maxLength = max => value =>
  value && value.length > max ? `${max} 文字以下で入力してください` : undefined
export const maxLength15 = maxLength(15)
export const minLength = min => value =>
  value && value.length < min ? `${min} 文字以上入力してください` : undefined
export const minLength2 = minLength(2)
export const number = value =>
  value && isNaN(Number(value)) ? '数字を入力してください' : undefined
export const minValue = min => value =>
  value && value < min ? `${min} 以上の数字を入力してください` : undefined
export const minValue13 = minValue(13)
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'メールアドレスが正しくありません'
    : undefined
export const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'アルファベットと数字のみ入力可能です'
    : undefined
export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? '電話番号が正しくありません'
    : undefined
export const confirmPassword = value => password => 
  value !== password 
    ? 'パスワードが一致しません' 
    : undefined;
export const url = value => 
  value && !/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i.test(value)
   ? 'URLが不正です'
   : undefined;
