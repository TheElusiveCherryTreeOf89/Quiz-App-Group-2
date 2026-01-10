const fs = require('fs');
const s = fs.readFileSync('c:/BS_Projects/quiz-app/src/components/Student/QuizPage.jsx', 'utf8');
let stackParen = [];
let stackBrace = [];
for (let i=0;i<s.length;i++){
  const ch = s[i];
  if (ch==='(') stackParen.push(i);
  else if (ch===')') { if (stackParen.length) stackParen.pop(); else stackParen.push(-i); }
  if (ch==='{') stackBrace.push(i);
  else if (ch==='}') { if (stackBrace.length) stackBrace.pop(); else stackBrace.push(-i); }
}
console.log('unmatched paren count', stackParen.length);
console.log('unmatched brace count', stackBrace.length);
if(stackParen.length) console.log('last unmatched paren context:', s.slice(Math.max(0, stackParen[stackParen.length-1]-60), stackParen[stackParen.length-1]+60).replace(/\n/g,'\\n'));
if(stackBrace.length) console.log('last unmatched brace context:', s.slice(Math.max(0, stackBrace[stackBrace.length-1]-60), stackBrace[stackBrace.length-1]+60).replace(/\n/g,'\\n'));
