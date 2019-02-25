const fs = require('fs');
const SEP = require('path').sep;
const FILE_CHARSET = 'utf-8';

let fn = {}

fn.exist = (path) =>{
  return fs.existsSync(path);  
}


/*
* 폴더가 없는 경우 폴더를 생성한다.(있음 물론 하지 않음)
* @param path 폴더경로
*/
fn.makeFolder = (path) =>{
	const folders = path.split(SEP);

  // check path is exist
  if(!fs.existsSync(path)){
    let paths = [];
    try{
      // make folder with recursivly
      for(let f of folders){
        paths.push(f);
        let p = paths.join(SEP);
        if(p!='' && !fs.existsSync(p)){
          fs.mkdirSync(p);
        }
      }
    }catch(e){
      console.error(new Date().toISOString(), 'make folder is fail : ', e);  
    }
  }
}

/*
* 파일 또는 폴더가 존재하는지 여부를 판단한다.
* @param path 경로
* @return 존재여부
*/
fn.isExist = (path) =>{
	return fs.existsSync(path);
}
fn.isNotExist = (path) =>{
	return !fn.isExist(path);
}

fn.append = (path, msg) => fs.appendFileSync( path, msg, FILE_CHARSET );
fn.write = (path, msg) => fs.writeFileSync( path, msg, FILE_CHARSET );
fn.read = (path) => fs.readFileSync( path, FILE_CHARSET );

module.exports = fn;