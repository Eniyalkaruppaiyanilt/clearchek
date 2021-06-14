express = require('express');
var router = express.Router();
var app = express();
const blockchain = require('../../middlewares/blockchain');
const BlockChain = require("../../middlewares/main");
const bchain = require("../../middlewares/main");

// router.get('/mine',function (req,res){
//     var last_proof;
//     let  last_block = Blockchain.last_block();
//     if (last_block == 0)
//     {
//         last_proof = 0;
//     }
//     else
//     {
//         last_proof = last_block.proof;
//     }
//     var proof = Blockchain.proof_of_work(last_proof);

  

//     var index = Blockchain.new_transaction(0, node_id,1);

//     let previous_hash = Blockchain.hash(last_block);
//     let block = Blockchain.new_block (proof, previous_hash);

//     res.send(JSON.stringify(block));
// });

router.post('/createblock', function (req, res, next){
    
    BlockChain.addBlock({sender: req.body.sender, reciver: req.body.reciver, amount: req.body.amount});

    res.send(JSON.stringify(BlockChain));
    console.dir(BlockChain,{depth:null})

    console.log("******** Validity of this blockchain: ", BlockChain.chainIsValid());

});
module.exports = router;