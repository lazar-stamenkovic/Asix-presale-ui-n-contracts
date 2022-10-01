import web3 from '../connection/web3'

export const DECIMALS = 10 ** 15

export const ether = (wei) => wei * DECIMALS

export const formatPrice = (price) => {
  price = Math.round(ether(price))

  return price
}

export function formatDate(date) {
  const newDate = new Date(date)
  return `${newDate.getDate()}/${
    newDate.getMonth() + 1
  }/${newDate.getFullYear()}`
}

export function toEther(number) {
  return web3.utils.fromWei(new web3.utils.BN(number.toString()), 'ether')
}

export function precision(a) {
  var e = 1
  while (Math.round(a * e) / e !== a) e *= 10
  return Math.log(e) / Math.LN10
}
