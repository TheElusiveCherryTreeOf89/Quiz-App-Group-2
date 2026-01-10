const fs = require('fs');
const s = fs.readFileSync('c:/BS_Projects/quiz-app/src/components/Student/QuizPage.jsx','utf8');
let p=0,b=0; let maxP={v:0,line:0}, maxB={v:0,line:0};
let inSingle=false,inDouble=false,inBack=false,inLineComment=false,inBlockComment=false;
let line=1;
for(let i=0;i<s.length;i++){
  const ch=s[i];
  const next=s[i+1];
  if(ch==='\n') { line++; if(inLineComment) inLineComment=false; }
  if(inLineComment) continue;
  if(inBlockComment){ if(ch==='*' && next==='/'){ inBlockComment=false; i++; } continue; }
  if(!inSingle && !inDouble && !inBack){
    if(ch==='/' && next==='/' ){ inLineComment=true; i++; continue; }
    if(ch==='/' && next==='*'){ inBlockComment=true; i++; continue; }
  }
  if(!inLineComment && !inBlockComment){
    if(!inDouble && !inBack && ch==="'") { inSingle = !inSingle; continue; }
    if(!inSingle && !inBack && ch==='"') { inDouble = !inDouble; continue; }
    if(!inSingle && !inDouble && ch==='`') { inBack = !inBack; continue; }
  }
  if(inSingle || inDouble || inBack) {
    if(ch==='\\') { i++; continue; }
    continue;
  }
  // not in string/comment
  if(ch==='(') p++;
  else if(ch===')') p--;
  if(ch==='{') b++;
  else if(ch==='}') b--;
  if(p>maxP.v){ maxP.v=p; maxP.line=line; }
  if(b>maxB.v){ maxB.v=b; maxB.line=line; }
}
console.log('final paren balance p=',p,' final brace balance b=',b);
console.log('max paren imbalance',maxP.v,'at line',maxP.line);
console.log('max brace imbalance',maxB.v,'at line',maxB.line);
const lines = s.split(/\r?\n/);
function printContext(l){
  const start=Math.max(0,l-6);
  const end=Math.min(lines.length,l+5);
  console.log('\n--- context around line',l,'---');
  for(let i=start;i<end;i++) console.log((i+1).toString().padStart(4,' ')+': '+lines[i]);
}
printContext(maxP.line);
printContext(maxB.line);
printContext(lines.length);
