const AsixV3Presale = artifacts.require('AsixV3Presale')
const AsixTokenV3 = artifacts.require('AsixTokenV3')

module.exports = async function (deployer, account) {
  await deployer.deploy(AsixV3Presale)
  const SaleI = await AsixV3Presale.deployed()
  await deployer.deploy(AsixTokenV3, 'AsixTest1', 'ATST1', SaleI.address)
}
