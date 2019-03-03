const monitor = require('./libs/monitor');
const WFILE = require('./libs/WFILE');
// const block_start = process.argv.slice(2)[0];

// comment

/*
{ timestamp: '2019-02-25T07:56:54',
    block_num: 30651278,
    transaction_num: 9,
    transaction_id: '85495c26c17d549f37754de0e1721e1907737b5f',
    cmd: 'custom_json',
    operation:
     { required_auths: [],
       required_posting_auths: [Array],
       id: 'follow',
       json:
        '["follow",{"follower":"modelcoinmc","following":"urbanacoustic","what":[]}]' } },		

*/

// monitor.on(['custom_json'], (data)=>{
//     for(let d of data){
//     	console.log(d.block_num, d.transaction_num, d.operation.id, d.operation.json);
//     }
// });

/*
		  { timestamp: '2019-02-25T08:01:00',
    block_num: 30651360,
    transaction_num: 17,
    transaction_id: 'e03c40e62bfae4464067f897386e8fe2e2948639',
    cmd: 'transfer',
    operation:
     { from: 'magicdice',
       to: 'idas4you',
       amount: '0.001 STEEM',
       memo:
        'You lost. Dice Roll: 80. Your prediction: under 74. MAGIC token reward: 2.5. Multiplier: 1.34. WinChance: 73%. {"betId":"5c73a0b9d4f27d59fba4bbc5","diceRoll":80,"refTransactionId":"c468d32c86e9b44dbc1d97d597319f9b748e7d4e","refBlockNumber":30651359,"serverSeedHash":"109019235b813e1f82754ac12c30e491c13f2e5872a51b92700168bec2d66e64","isValid":true}' } },
*/

/*
	@drugwars-dealer
	@drugwars

	 { from: 'kushalbang93',
  to: 'drugwars-dealer',
  amount: '3.834 STEEM',
  memo: 'upgrade:cocina' }
*/

let START_BLOCK = 30832827; //3.4 

function start(){
  monitor.on(['transfer'], (data)=>{
    let res = [];
    for(let d of data){
      let to = d.operation.to;
      let memo = d.operation.memo;//upgrade:cocina;
      if(to.indexOf('drugwars-dealer')>=0 && memo.indexOf('upgrade:cocina')>=0){
        res.push({block:d.block_num, from:d.operation.from, amount:d.operation.amount});
      }
    }
    if(res.length>0){
      WFILE.append('./cocina.sm', JSON.stringify(res));
      console.log(res);
      console.log( data[data.length-1].block_num, monitor.getDateStr(data[data.length-1].timestamp), res.length  ); 
    }else{
      console.log( data[data.length-1].block_num);
    }
    START_BLOCK = data[data.length-1].block_num;
  }, START_BLOCK);  
}

function init(){
  try{
    start();
  }catch(e){
    setTimeout(function(){
      init();  
    }, 3000);
  }
}
init();




