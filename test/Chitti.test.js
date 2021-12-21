const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledChitti = require('../ethereum/build/Chitti.json');

let accounts, chitti;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();

    chitti = await new web3.eth.Contract(compiledChitti.Chitti.abi)
        .deploy({data: compiledChitti.Chitti.evm.bytecode.object})
        .send({from: accounts[0], gas: '2000000'})
});

describe('Chitti Testing', () => {
    it('Deploy Chitti!', ()=>{
        assert.ok(chitti.options.address);
    });

    it('Create a Topic!', async() => {
        try {
            await chitti.methods.newTopic('Sample').send({
                from: accounts[1],
                gas: '1000000'
            });
            const chitData = await chitti.methods.topics(0).call();
            assert(chitData.topic, 'Sample');
        } catch (error) {
            assert(false);
        }
    });

    it('Post a Chit!', async() => {
        try {
            await chitti.methods.newTopic('Sample').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.newChit(0, 'SivaMani').send({
                from: accounts[1],
                gas: '1000000'
            });
            const chitData = await chitti.methods.getChits(0).call();
            assert(chitData.length, 1);
        } catch (error) {
            console.log(error)
            assert(false);
        }
    });

    it('Like a Chit!', async() => {
        try {
            await chitti.methods.newTopic('Sample').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.newChit(0, 'SivaMani').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.reactOnChit(0, 0, 1).send({
                from: accounts[2],
                gas: '1000000'
            });
            const chitData = await chitti.methods.getChits(0).call();
            assert(chitData[0].likes_count, 1);
        } catch (error) {
            assert(false);
        }
    });

    it('Dislike a Chit!', async() => {
        try {
            await chitti.methods.newTopic('Sample').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.newChit(0, 'SivaMani').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.reactOnChit(0, 0, 2).send({
                from: accounts[2],
                gas: '1000000'
            });
            const chitData = await chitti.methods.getChits(0).call();
            assert(chitData[0].dislikes_count, 1);
        } catch (error) {
            assert(false);
        }
    });

    it('Update a Chit!', async() => {
        try {
            await chitti.methods.newTopic('Sample').send({
                from: accounts[2],
                gas: '1000000'
            });
            await chitti.methods.newChit(0, 'SivaMani').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.updateChit(0, 0, 'Updated Post').send({
                from: accounts[1],
                gas: '1000000'
            });
            const chitData = await chitti.methods.getChits(0).call();
            assert(chitData[0].message, 'Updated Post');
        } catch (error) {
            assert(false);
        }
    });

    it('Update a Chit with different account!', async() => {
        try {
            await chitti.methods.newTopic('Sample').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.newChit(0, 'SivaMani').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.updateChit(0, 0, 'Updated Post').send({
                from: accounts[2],
                gas: '1000000'
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });

    it('Reply to a Chit!', async() => {
        try {
            await chitti.methods.newTopic('Sample').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.newChit(0, 'SivaMani').send({
                from: accounts[1],
                gas: '1000000'
            });
            await chitti.methods.newChitReply(0, 'This is a Reply', 0).send({
                from: accounts[1],
                gas: '1000000'
            });
            let chitData = await chitti.methods.getChits(0).call();
            assert(chitData.length, 2);
            assert(chitData[1].reply_index, 0);
            assert(chitData[1].message, 'This is a Reply');
        } catch (error) {
            assert(false);
        }
    });

    it('Create to a Chit without any topic!', async() => {
        try {
            await chitti.methods.newChit(0, 'SivaMani').send({
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);
        } catch (error) {
            assert(true);
        }
    });
})
