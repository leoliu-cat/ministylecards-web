const text = `![Alt-MiniStyleCards Kay老師蠟筆風客製插畫作品$i，婚紗照客製人像插畫設計，溫暖手繪筆觸婚禮喜帖插畫]
(https://cdn.ministylecards.com/illustration/kay/kay-crayon-illustration-portfolio-$i.jpg)
`;

const varName = '$i';
const escapedVarName = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const imgRegex = new RegExp(`!\\[([\\s\\S]*?)\\]\\s*\\(([\\s\\S]*?` + escapedVarName + `[\\s\\S]*?)\\)`, 'g');

console.log('escapedVarName:', escapedVarName);
console.log('regex:', imgRegex);
console.log('match:', text.match(imgRegex));
console.log('replace:', text.replace(imgRegex, 'MATCHED'));
