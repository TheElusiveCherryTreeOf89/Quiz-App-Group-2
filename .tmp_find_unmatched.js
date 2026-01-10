const fs=require('fs');
const s=fs.readFileSync('c:/BS_Projects/quiz-app/src/components/Student/QuizPage.jsx','utf8');
const fs=require('fs');
const s=fs.readFileSync('c:/BS_Projects/quiz-app/src/components/Student/QuizPage.jsx','utf8');
let stack=[];
let inString=false,stringChar='';
let inLineComment=false,inBlockComment=false;
for(let i=0;i<s.length;i++){
  const ch=s[i];
  const next=s[i+1];
  if(inLineComment){ if(ch==='\n') inLineComment=false; continue; }
  if(inBlockComment){ if(ch==='*' && next==='/' ){ inBlockComment=false; i++; continue;} else continue; }
  if(!inString){
    if(ch==='/' && next=='/') { inLineComment=true; i++; continue; }
    if(ch==='/' && next=='*') { inBlockComment=true; i++; continue; }
    if(ch==="'"||ch==='"'||ch==='`'){ inString=true; stringChar=ch; continue; }
    if(ch==='(') stack.push({ch:'(',pos:i});
    else if(ch===')'){
      const top=stack[stack.length-1];
      if(top && top.ch==='(') stack.pop(); else stack.push({ch:')',pos:i});
    }
    if(ch==='{') stack.push({ch:'{',pos:i});
    else if(ch==='}'){
      const top=stack[stack.length-1];
      if(top && top.ch==='{') stack.pop(); else stack.push({ch:'}',pos:i});
    }
  } else {
    if(ch==='\\') { i++; continue; }
    if(ch===stringChar) inString=false;
  }
}
if(stack.length===0){ console.log('No unmatched tokens.'); process.exit(0); }
console.log('Unmatched stack length',stack.length);
stack.forEach(item=>{
  const until=s.slice(Math.max(0,item.pos-40),item.pos+40).replace(/\n/g,'\\n');
  console.log(item.ch,' at pos',item.pos, 'context:', until);
});
