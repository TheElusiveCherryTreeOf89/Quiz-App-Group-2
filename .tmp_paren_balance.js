const fs = require('fs');
const path = 'c:/BS_Projects/quiz-app/src/components/Student/QuizPage.jsx';
const s = fs.readFileSync(path,'utf8').split(/\r?\n/);
let p=0,b=0; let maxP={v:0,line:0}, maxB={v:0,line:0};
for(let i=0;i<s.length;i++){
  const line=s[i];
  const op=(line.match(/\(/g)||[]).length;
  const cl=(line.match(/\)/g)||[]).length;
  const ob=(line.match(/{/g)||[]).length;
  const cb=(line.match(/}/g)||[]).length;
  p += op-cl; b += ob-cb;
  if(p>maxP.v){ maxP.v=p; maxP.line=i+1 }
  if(b>maxB.v){ maxB.v=b; maxB.line=i+1 }
}
console.log('final paren balance p=',p,' final brace balance b=',b);
console.log('max paren imbalance',maxP.v,'at line',maxP.line);
console.log('max brace imbalance',maxB.v,'at line',maxB.line);
// print context lines around those
function printContext(line){
  const start=Math.max(0,line-6);
  const end=Math.min(s.length,line+5);
  console.log('\n--- context around line',line,'---');
  for(let i=start;i<end;i++){
    console.log((i+1).toString().padStart(4,' ')+': '+s[i]);
  }
}
printContext(maxP.line);
printContext(maxB.line);
printContext(s.length);
