const Staking = artifacts.require("Staking");

contract('Staking', () => {
  it('should read newly written values', async() => {
    const stakingInstance = await Staking.deployed();
    // var value = (await stakingInstance.read.call()).toNumber();

    // assert.equal(value, 0, "0 wasn't the initial value");

    // await stakingInstance.write(1);
    // value = (await stakingInstance.read.call()).toNumber();
    // assert.equal(value, 1, "1 was not written");

    // await stakingInstance.write(2);
    // value = (await stakingInstance.read.call()).toNumber();
    // assert.equal(value, 2, "2 was not written");
  });
});
