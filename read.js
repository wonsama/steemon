const WFILE = require('./libs/WFILE');

let res = JSON.parse(WFILE.read('./data.sm'));
res.sort((a,b)=>{
  return Number(a.amount.split(' ')[0]) - Number(b.amount.split(' ')[0]);
});
/*
{ from: 'v4vapid',
  to: 'drugwars-dealer',
  amount: '163.399 STEEM',
  memo: 'unit:bouncer,amount:1000' }
*/
// let memos = [];
// for(let r of res){
//   if(r.memo.indexOf('amount')>0){

//     let m = r.memo.split(',');
//     let unit = m[0].split(':')[1];
//     let amount = m[1].split(':')[1];
//     let steem_amount = r.amount.split(' ')[0];

//     console.log( r.from.padStart(16,' '), unit.padStart(10,' '), amount.padStart(4,' '), steem_amount.padStart(8,' '));
//   }
// }

let upgrade_cnt = {};
for(let r of res){
  if(r.memo.indexOf('upgrade:')>=0){
    let item = r.memo.split(':')[1];
    if(!upgrade_cnt[item]){
      upgrade_cnt[item] = 1;
    }else{
      upgrade_cnt[item] = upgrade_cnt[item] + 1;
    }
  }
}
let items = [];
for(let r of Object.entries(upgrade_cnt)){
  items.push({name : r[0], value: r[1]});
}
items.sort((a,b)=>a.value-b.value);
for(let item of items){
  console.log(item);
}


// "from":"secretscandies","to":"drugwars-dealer","amount":"4.854 STEEM","memo":"upgrade:industrial_distillery"


/*

	[ 
  'upgrade:headquarters',
  'upgrade:operation_center',
  'upgrade:ammunition',
  'upgrade:drug_storage',
  'upgrade:meth_lab',
  'upgrade:pharma_lab',
  'upgrade:blackmarket',
  'upgrade:training_facility',
  'upgrade:hydrofarm',
  'upgrade:cocina',
  'upgrade:crackhouse',
  'upgrade:industrial_distillery',
  'upgrade:metalprint',
  'upgrade:weapon_factory',
  'upgrade:smuggle',
  'upgrade:bar',
  'upgrade:brewery',
  'upgrade:castle',
  'upgrade:weapon_storage',
  'upgrade:alcohol_storage',
  'upgrade:t_distillery',
  'upgrade:pantheon']
*/


// console.log(memos);

// console.log( res.length );

