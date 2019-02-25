const WFILE = require('./libs/WFILE');

let res = JSON.parse(WFILE.read('./out.txt'));

// "from":"secretscandies","to":"drugwars-dealer","amount":"4.854 STEEM","memo":"upgrade:industrial_distillery"


/*

	[ 'upgrade:headquarters',
  'upgrade:operation_center',
  'unit:bouncer,amount:1',
  'upgrade:ammunition',
  'unit:gunman,amount:1',
  'unit:bouncer,amount:10',
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
  'unit:knifer,amount:1',
  'upgrade:weapon_factory',
  'upgrade:smuggle',
  'upgrade:bar',
  'upgrade:brewery',
  'upgrade:castle',
  'upgrade:weapon_storage',
  'upgrade:alcohol_storage',
  'unit:bouncer,amount:1000',
  'unit:gunman,amount:200',
  'upgrade:t_distillery',
  'unit:bouncer,amount:2',
  'unit:knifer,amount:2',
  'unit:gunman,amount:2',
  'upgrade:pantheon',
  'unit:gunman,amount:4',
  'unit:knifer,amount:7',
  'unit:bouncer,amount:3',
  'unit:bouncer,amount:5',
  'unit:bouncer, amount:4',
  'unit:gunman,amount:7',
  'unit:bouncer,amount:7',
  'unit:gunman,amount:10' ]
*/

let memos = [];
for(let r of res){
	if(r.memo.indexOf('amount')>0){
		console.log(r);
	}
}
// console.log(memos);

// console.log( res.length );

